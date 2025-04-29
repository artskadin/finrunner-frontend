import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { Button, Text } from '@gravity-ui/uikit'
import { queryClient } from '@/app/main'
import {
  archiveExchangePairApi,
  ArchiveExchangePairPayload,
  ArchiveExchangePairSuccessResponse,
  ExchangePair
} from '@/shared/api/v1/exchangePairsApi'

import styles from './styles.module.css'
import { ExchangePairContainer } from '../ExchangePairContainer'

interface ArchiveExchangePairFormProps {
  onClose: () => void
  exchangePair: ExchangePair
}

export function ArchiveExchangePairForm({
  onClose,
  exchangePair
}: ArchiveExchangePairFormProps) {
  const { mutate: archiveExchangePair, isPending } = useMutation<
    ArchiveExchangePairSuccessResponse,
    AxiosError,
    ArchiveExchangePairPayload
  >({
    mutationFn: archiveExchangePairApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'exchangePairs', 'getAll']
      })

      onClose()
    },
    onError: () => {
      console.error('Не удалось архивировать ExchangePair')
      onClose()
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    archiveExchangePair({ id: exchangePair.id })
  }

  return (
    <div className={styles['archive-exchange-pair-container']}>
      <div className={styles['archive-exchange-pair-header']}>
        <Text variant='header-1'>
          Вы уверены, что хотите архивировать эту обменную пару?
        </Text>

        <ExchangePairContainer exchangePair={exchangePair} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles['archive-exchange-pair-actions']}>
          <Button
            type='submit'
            size='l'
            view='outlined-danger'
            disabled={isPending}
          >
            Архивировать
          </Button>
          <Button
            size='l'
            view='flat-secondary'
            onClick={onClose}
            disabled={isPending}
          >
            Отменить
          </Button>
        </div>
      </form>
    </div>
  )
}
