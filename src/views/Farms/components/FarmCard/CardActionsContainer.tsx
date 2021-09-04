import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text } from '@ricefarm/uikitv2'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import useApproveFarm from '../../hooks/useApproveFarm'

const Action = styled.div`
  padding-top: 16px;
`

const getDisplayTime = (time, isSeconds = false) => {
  if (!time) {
    return isSeconds ? '00' : null
  }

  const timeFixed = parseFloat(time).toFixed(0) 
  return timeFixed.toString().length === 2 ? timeFixed.toString() : `0${timeFixed}`
}

const calculateTimeLeft = (unixTimeStamp) => {
  const difference = +new Date(parseInt(unixTimeStamp) * 1000) - +new Date()
  let timeLeftArray = []

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((difference / 1000 / 60) % 60)
  const seconds = Math.floor((difference / 1000) % 60)

  if (difference > 0) {
    timeLeftArray = [
      getDisplayTime(days),
      getDisplayTime(hours),
      getDisplayTime(minutes),
      getDisplayTime(seconds, true),
    ]
  }

  const timesuffix = ['d', 'h', 'm', 's']

  let toDisplay = ''
  for (let i = 0; i < 4; i++) {
    if (typeof timeLeftArray[i] !== 'undefined' && timeLeftArray[i] !== null) {
      toDisplay = `${toDisplay}${timeLeftArray[i]}${timesuffix[i]} `
    }
  }
  return toDisplay
}

export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
    canHarvest,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const earnings = new BigNumber(earningsAsString)
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()

  const lpContract = useERC20(lpAddress)
  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  const nextHarvestValue = farm.userData.nextHarvest ? farm.userData.nextHarvest : 0
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(nextHarvestValue))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(nextHarvestValue))
    }, 1000)
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  })

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <Flex justifyContent="space-between" mb="12px">
        <div>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            RICE
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Earned')}
          </Text>
        </div>
       
        {earnings.gt(0) && !canHarvest &&  <Text fontSize="14px">{timeLeft}</Text>}
        {/* {earnings.gt(0) && !canHarvest && <TimerIconLink onClick={onHarvestTimer} />} */}
      </Flex>
      <HarvestAction farm={farm} earnings={earnings} pid={pid} />
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
