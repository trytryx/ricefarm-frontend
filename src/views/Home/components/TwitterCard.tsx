import React from 'react'
import { Card, CardBody, Heading } from '@ricefarm/uikitv2'
import styled from 'styled-components'
import { Timeline } from 'react-twitter-widgets'
import { useTranslation } from 'contexts/Localization'
import { TWITTER_USERNAME } from 'config'
import useTheme from '../../../hooks/useTheme'

const StyledTwitterCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`
const TwitterCard = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <StyledTwitterCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Announcements')}
        </Heading>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: TWITTER_USERNAME,
          }}
          options={{
            theme: isDark ? 'dark' : 'light',
            height: '420',
            chrome: 'noheader, nofooter',
            width: '100%',
          }}
        />
      </CardBody>
    </StyledTwitterCard>
  )
}

export default TwitterCard
