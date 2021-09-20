import React from 'react'
import styled from 'styled-components'
import {
  useTotalSupply,
  useBurnedBalance,
  useRicePerBlock,
  useLockedRewards,
  useMaxTransferAmount,
  useTransferTaxRate,
} from 'hooks/useTokenBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { Flex, Text, Heading, Skeleton } from '@ricefarm/uikitv2'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const CakeDataRow = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()))
  const lockedRewards = getBalanceNumber(useLockedRewards())
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance - lockedRewards : 0
  const cakePriceBusd = usePriceCakeBusd()
  const mcap = cakePriceBusd.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  const maxTransferAmount = getBalanceNumber(useMaxTransferAmount())
  const transferTaxRate = useTransferTaxRate()
  const ricePerBlock = getBalanceNumber(useRicePerBlock())

  return (
    <div>
      <Grid>
        <Flex flexDirection="column">
          <Text color="textSubtle">{t('Total minted rice')}</Text>
          {totalSupply ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={getBalanceNumber(totalSupply)} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </Flex>
        <StyledColumn>
          <Text color="textSubtle">{t('Total Burned')}</Text>
          {burnedBalance ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn>
          <Text color="textSubtle">{t('Locked Rewards')}</Text>
          {lockedRewards ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={lockedRewards} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn>
          <Text color="textSubtle">{t('Circulating Supply')}</Text>
          {cakeSupply ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
      </Grid>

      <Grid>
        <Flex flexDirection="column">
          <Text color="textSubtle">{t('Max Transaction')}</Text>
          {maxTransferAmount ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={maxTransferAmount} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </Flex>
        <StyledColumn>
          <Text color="textSubtle">{t('Transfer Tax')}</Text>
          {transferTaxRate ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={transferTaxRate.toNumber()} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn noMobileBorder>
          <Text color="textSubtle">{t('Market Cap')}</Text>
          {mcap?.gt(0) && mcapString ? (
            <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn>
          <Text color="textSubtle">{t('Current Emissions')}</Text>

          <Heading scale="lg">{t('%cakeEmissions%/block', { cakeEmissions: ricePerBlock })}</Heading>
        </StyledColumn>
      </Grid>
    </div>
  )
}

export default CakeDataRow
