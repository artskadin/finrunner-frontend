import { AxiosError } from 'axios'
import { Button, Text } from '@gravity-ui/uikit'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { queryClient } from '@/app/main'
import {
  Currency,
  deleteCurrencyApi,
  DeleteCurrencyParams,
  DeleteCurrencySuccessResponse
} from '@/shared/api/v1/currency'

import styles from './styles.module.css'

interface DeleteCurrencyFormProps {
  onClose: () => void
  currency: Currency
}

export function DeleteCurrencyForm({
  onClose,
  currency
}: DeleteCurrencyFormProps) {
  const router = useRouter()

  const { mutate: deleteCurrency, isPending: isDeletingCurrency } = useMutation<
    DeleteCurrencySuccessResponse,
    AxiosError,
    DeleteCurrencyParams
  >({
    mutationFn: deleteCurrencyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'currencies', 'getAll']
      })

      router.invalidate().then(() => {
        onClose()
      })
    },
    onError: (err) => {
      console.error(`Failed to delete currency. Error: ${err}`)

      router.invalidate().then(() => {
        // Выводить ошибку, если будет мешать!
        onClose()
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    deleteCurrency({ id: currency.id })
  }

  return (
    <div className={styles['delete-currency-container']}>
      <div className={styles['delete-currency-header']}>
        <Text variant='header-1'>Вы уверены, что хотите удалить</Text>
        <Text variant='header-1' color='info'>
          {currency.fullname} – {currency.shortname}?
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles['delete-currency-actions']}>
          <Button
            type='submit'
            size='l'
            view='outlined-danger'
            disabled={isDeletingCurrency}
          >
            Удалить
          </Button>
          <Button
            size='l'
            view='flat-secondary'
            disabled={isDeletingCurrency}
            onClick={onClose}
          >
            Отменить
          </Button>
        </div>
      </form>
    </div>
  )
}
