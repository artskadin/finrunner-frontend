import { useState } from 'react'
import { Button, Switch, Text } from '@gravity-ui/uikit'
import { ExchangePair } from '@/shared/api/v1/exchangePairsApi'

import styles from './styles.module.css'

interface ExchangePairStatusPopoverProps {
  exchangePairId: string
  status: ExchangePair['status']
  isUpdating: boolean
  onUpdate: ({
    exchangePairId,
    status,
    markupPercentage
  }: {
    exchangePairId: string
    status?: ExchangePair['status']
    markupPercentage?: string
  }) => void
}

export function ExchangePairStatusPopover({
  exchangePairId,
  isUpdating,
  onUpdate,
  status
}: ExchangePairStatusPopoverProps) {
  const [currenctStatus, setCurrentStatus] = useState(status)

  const handleSave = () => {
    if (currenctStatus !== status) {
      onUpdate({ exchangePairId, status: currenctStatus })
    }
  }

  return (
    <div className={styles['changeable-prop_popover']}>
      <Text variant='body-2'>Редактирование статуса</Text>

      {status === 'ARCHIVED' && (
        <Text variant='body-2' color='warning'>
          Нельзя менять архивные обменные пары!
        </Text>
      )}

      <Switch
        checked={currenctStatus === 'ACTIVE'}
        onUpdate={(value) =>
          value ? setCurrentStatus('ACTIVE') : setCurrentStatus('INACTIVE')
        }
        content={currenctStatus === 'ACTIVE' ? 'Включена' : 'Отключена'}
        disabled={status === 'ARCHIVED' || isUpdating}
      />

      <Button
        size='m'
        view='action'
        disabled={isUpdating || status === 'ARCHIVED'}
        onClick={handleSave}
      >
        Сохранить
      </Button>
    </div>
  )
}
