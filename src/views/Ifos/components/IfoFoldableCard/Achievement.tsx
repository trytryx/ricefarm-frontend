import React from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, Button, Text, MetamaskIcon /* Skeleton */ } from '@ricefarm/uikitv2'
import { useTranslation } from 'contexts/Localization'
import { PublicIfoData } from 'views/Ifos/types'
import { Ifo } from 'config/constants/types'
// import { BIG_TEN } from 'utils/bigNumber'
import { getBscScanLink } from 'utils'
import { registerToken } from 'utils/wallet'

// const MIN_DOLLAR_FOR_ACHIEVEMENT = BIG_TEN

interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoData
}

const Container = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: initial;
  }
`

// const AchievementFlex = styled(Flex)<{ isFinished: boolean }>`
//   ${({ isFinished }) => (isFinished ? 'filter: grayscale(100%)' : '')};
// `

const StyledLinkExternal = styled(LinkExternal)`
  margin-top: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`
const StyledLink = styled(Text)`
  display: flex;
  align-items: center;
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`

const Achievement: React.FC<Props> = ({ ifo /* publicIfoData */ }) => {
  const { t } = useTranslation()
  // const tokenName = ifo.token.symbol.toLowerCase()
  const campaignTitle = ifo.name
  // const minLpForAchievement = MIN_DOLLAR_FOR_ACHIEVEMENT.div(publicIfoData.currencyPriceInUSD).toNumber()

  return (
    <Container>
      {/* <AchievementFlex isFinished={publicIfoData.status === 'finished'} alignItems="center" flexGrow={1}>
        <Image src={`/images/achievements/ifo-${tokenName}.svg`} width={56} height={56} mr="8px" />
        <Flex flexDirection="column">
          <Text color="secondary" fontSize="12px">
            {`${t('Achievement')}:`}
          </Text>
          <Flex>
            <Text bold mr="8px">
              {t('IFO Shopper: %title%', { title: campaignTitle })}
            </Text>
            <Flex alignItems="center" mr="8px">
              <PrizeIcon color="textSubtle" width="16px" mr="4px" />
              <Text color="textSubtle">{publicIfoData.numberPoints}</Text>
            </Flex>
          </Flex>
          {publicIfoData.currencyPriceInUSD.gt(0) ? (
            <Text color="textSubtle" fontSize="12px">
              {t('Commit ~%amount% LP in total to earn!', { amount: minLpForAchievement.toFixed(3) })}
            </Text>
          ) : (
            <Skeleton minHeight={18} width={80} />
          )}
        </Flex>
      </AchievementFlex> */}
      <Flex flexDirection="column" />
      <Flex alignItems="flex-end" flexDirection="column">
        <StyledLinkExternal href={ifo.articleUrl} mb="8px">
          {t('Learn more about %title%', { title: campaignTitle })}
        </StyledLinkExternal>
        <StyledLinkExternal href={getBscScanLink(ifo.address, 'address')}>{t('View Contract')}</StyledLinkExternal>
        <StyledLink>
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() =>
              registerToken(ifo.token.address[process.env.REACT_APP_CHAIN_ID], ifo.token.symbol, ifo.token.decimals)
            }
          >
            <Text color="primary" bold fontSize="16px">
              Add to Metamask
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </StyledLink>
      </Flex>
    </Container>
  )
}

export default Achievement
