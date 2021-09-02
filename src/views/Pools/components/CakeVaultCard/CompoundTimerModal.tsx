import React, { useEffect, useState } from 'react'
import { Button, Modal, Text } from '@ricefarm/uikitv2'
import ModalActions from 'components/ModalActions'
import { useTranslation } from 'contexts/Localization'
import { useFarmFromPid } from 'state/hooks'

interface CompoundTimerModalProps {
  pid: number
  nextHarvestUntil: string
  onDismiss?: () => void
}

const getDisplayTime = (time, isSeconds = false) => {
  if (!time) {
    return isSeconds ? '00' : null
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

const CompoundTimerModal: React.FC<CompoundTimerModalProps> = ({ onDismiss, nextHarvestUntil, pid }) => {
  const { t } = useTranslation()
  const farm = useFarmFromPid(pid)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(nextHarvestUntil))
  const delayInHours = (farm.harvestInterval / 60 / 60).toFixed(2)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(nextHarvestUntil))
    }, 1000)
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  })
  return (
    <Modal title={t('Compound Rice Vault In')} onDismiss={onDismiss}>
      <Text bold fontSize="46px" textAlign="center">
        {timeLeft}
      </Text>
      <Text textAlign="center">Rice Vault</Text>
      <Text textAlign="center">{`Delay: ${Number.isNaN(delayInHours) ? '-' : delayInHours} hour(s)`}</Text>
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Close')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default CompoundTimerModal
