import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text, TimerIcon, useModal } from '@ricefarm/uikitv2'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import HarvestTimerModal from 'views/Farms/components/FarmCard/HarvestTimerModal'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import useApproveFarm from '../../hooks/useApproveFarm'
import WithdrawalFeeTimer from './WithdrawalFeeTimer'

const TimerIconLink = styled(TimerIcon)`
  cursor: pointer;
`

const Action = styled.div`
  padding-top: 16px;
`
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

  // const [onHarvestTimer] = useModal(<HarvestTimerModal farm={farm} />)

  const calcSecondsLeft = (unixTimeStamp) => {
    const difference = +new Date(parseInt(unixTimeStamp) * 1000) - +new Date()
    return (unixTimeStamp !== null && unixTimeStamp > 0) ? difference : 0
  } 

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
  const [secondsRemaining, setSecondsRemaining] = useState(calcSecondsLeft(nextHarvestValue))
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSecondsRemaining(calcSecondsLeft(nextHarvestValue))
    }, 1000)
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  },[nextHarvestValue])

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
       
        {earnings.gt(0) && !canHarvest &&  <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
        {/* {earnings.gt(0) && !canHarvest && <TimerIconLink onClick={onHarvestTimer} />} */}
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} />
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
