import React from 'react'
import styled from 'styled-components'
import { Box, Heading, Text } from '@ricefarm/uikitv2'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'

const StyledHero = styled.div`
  background-color: ${({ theme }) => (theme.isDark ? '#396a63' : '#e9faff')};
  background-image: url('/images/ifo-header.svg');
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: contain;
  padding-bottom: 60px;
  padding-top: 40px;
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <Box mb="32px">
      <StyledHero>
        <Container>
          <Heading as="h1" scale="xl" mb="24px">
            {t('IFO: Initial Farm Offerings')}
          </Heading>
          <Text bold fontSize="20px">
            {t('Buy new tokens with a brand new token sale model.')}
          </Text>
        </Container>
      </StyledHero>
    </Box>
  )
}

export default Hero
