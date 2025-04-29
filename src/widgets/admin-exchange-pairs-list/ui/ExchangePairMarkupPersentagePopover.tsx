import { useState } from 'react'
import { Button, Text, TextInput } from '@gravity-ui/uikit'
import { ExchangePair } from '@/shared/api/v1/exchangePairsApi'
import { markupPercentageSchema } from '../utils/markupPercentageSchema'

import styles from './styles.module.css'

interface ExchangePairMarkupPersentagePopoverProps {
  exchangePairId: string
  markupPercentage: string
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

export function ExchangePairMarkupPersentagePopover({
  exchangePairId,
  markupPercentage,
  isUpdating,
  onUpdate
}: ExchangePairMarkupPersentagePopoverProps) {
  const [currentMarkupPercentage, setCurrentMarkupPercentage] =
    useState(markupPercentage)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleUpdate = (value: string) => {
    setValidationError(null)
    setCurrentMarkupPercentage(value)
  }

  const handleSave = () => {
    setValidationError(null)

    const checkedValue = markupPercentageSchema.safeParse(
      currentMarkupPercentage
    )

    if (currentMarkupPercentage !== markupPercentage && checkedValue.success) {
      onUpdate({ exchangePairId, markupPercentage: currentMarkupPercentage })
    }

    if (!checkedValue.success) {
      setValidationError(
        'Число должно быть в виде десятичной дроби (к примеру, 0.5)'
      )
    }
  }

  return (
    <div className={styles['changeable-prop_popover']}>
      <Text variant='body-2'>Редактирование комиссии</Text>

      <TextInput
        size='l'
        placeholder='К примеру, 1.5'
        value={currentMarkupPercentage}
        onUpdate={handleUpdate}
        hasClear
      />

      {validationError && (
        <Text variant='body-2' color='danger'>
          {validationError}
        </Text>
      )}

      <Button size='m' view='action' onClick={handleSave} disabled={isUpdating}>
        Сохранить
      </Button>
    </div>
  )
}
