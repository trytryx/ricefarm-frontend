import React from 'react'
import BigNumber from 'bignumber.js'
import { Button, useModal } from '@ricefarm/uikitv2'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import ContributeModal from './ContributeModal'
import GetLpModal from './GetLpModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}
const ContributeButton: React.FC<Props> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]
  const { isPendingTx, amountTokenCommittedInLP } = userPoolCharacteristics
  const { limitPerUserInLP } = publicPoolCharacteristics
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const currency = (poolId === 'poolBasic' ? ifo.currency : ifo.currency2) || ifo.currency
  const { balance: userCurrencyBalance } = useTokenBalance(getAddress(currency.address))

  
  // Re-fetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber) => {
    await Promise.all([publicIfoData.fetchIfoData(), walletIfoData.fetchIfoData()])
    toastSuccess(
      t('Success!'),
      t('You have contributed %amount% %lpName% tokens to this IFO!', { 
        amount: getBalanceNumber(amount),
        lpName: currency.symbol,
      }),
    )
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={userCurrencyBalance}
    />,
    false,
  )

  const [onPresentGetLpModal] = useModal(<GetLpModal currency={currency} />, false)

  const isDisabled =
    isPendingTx ||
    (limitPerUserInLP.isGreaterThan(0) && amountTokenCommittedInLP.isGreaterThanOrEqualTo(limitPerUserInLP))

  return (
    <Button
      onClick={userCurrencyBalance.isEqualTo(0) ? onPresentGetLpModal : onPresentContributeModal}
      width="100%"
      disabled={isDisabled}
    >
      {isDisabled ? t('Max. Committed') : t('Commit LP Tokens')}
    </Button>
  )
}

export default ContributeButton
