import React, { useEffect, useState } from 'react'
import { Button, Modal, Text } from '@ricefarm/uikitv2'
import ModalActions from 'components/ModalActions'
import { useTranslation } from 'contexts/Localization'
import { Farm } from 'state/types'

interface HarvestTimerModalProps {
  farm: Farm
  onDismiss?: () => void
}

const getDisplayTime = (time, isSeconds = false) => {
  if (!time) {
    // return isSeconds ? '00' : null
    return isSeconds ? '00' : '00'
  }
  return time.toString().length === 2 ? time.toString() : `0${time}`
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

  let toDisplay = ''
  for (let i = 0; i < 4; i++) {
    let t = timeLeftArray[i]
    if (t) {
      t = i < 3 ? `${t}:` : t
      toDisplay = `${toDisplay}${t}`
    }
  }
  return toDisplay
}

const HarvestTimerModal: React.FC<HarvestTimerModalProps> = ({ onDismiss, farm }) => {
  const { t } = useTranslation()
  const nextHarvestValue = farm.userData.nextHarvest ? farm.userData.nextHarvest : 0
  const label = farm.isTokenOnly ? `Pool: ${farm.lpSymbol}` : `Farm: ${farm.lpSymbol}`
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(nextHarvestValue))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(nextHarvestValue))
    }, 1000)
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  })
  return (
    <Modal title={t('Harvest In')} onDismiss={onDismiss}>
      <Text bold fontSize="46px" textAlign="center">
        {timeLeft}
      </Text>
      <Text textAlign="center">{label}</Text>
      <Text textAlign="center">{`Delay: ${farm.harvestInterval / 60 / 60} hour(s)`}</Text>
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Close')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default HarvestTimerModal
