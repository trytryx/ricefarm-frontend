import React from 'react'
import { Button, Modal, Text } from '@ricefarm/uikitv2'
import ModalActions from 'components/ModalActions'
import { useTranslation } from 'contexts/Localization'

interface NoticeModalProps {
  onDismiss?: () => void
}

const NoticeModal: React.FC<NoticeModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Notice: LP Types')} hideCloseButton onDismiss={onDismiss}>
      <Text textAlign="center">Our farms take two different types of LPs</Text>
      <br />
      <Text textAlign="center">• TeslaSafe Farms: Trade TeslaSafe v1</Text>
      <Text textAlign="center">• Rice Farms: Trade Rice v2</Text>
      <br />
      <Text textAlign="center">Please make sure to use the right exchange.</Text>
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('I Agree To Use Correct LP')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default NoticeModal
