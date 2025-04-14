import { useState } from 'react'
import { AxiosError } from 'axios'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button, Icon, Modal, Text, Tooltip } from '@gravity-ui/uikit'
import { Copy, Pencil, TrashBin } from '@gravity-ui/icons'
import { Route as CurrencyRoute } from '@/routes/admin/currencies'
import { Route as AdminRoute } from '@/routes/admin/route'
import { iaAvailableForAdmin } from '@/shared/utils/checkUserRules'
import { queryClient } from '@/app/main'
import { CreateCurrencyForm } from './CurrencyForm'
import {
  Currency,
  deleteCurrencyApi,
  DeleteCurrencyParams,
  DeleteCurrencySuccessResponse
} from '@/shared/api/currency'

import styles from './styles.module.css'

export function CurrencyPage() {
  const currencyRouteData = CurrencyRoute.useLoaderData()
  const adminRouteData = AdminRoute.useLoaderData()

  const router = useRouter()

  const [updatingCurrency, setUpdatingCurrency] = useState<Currency | null>(
    null
  )
  const [isCreateCurrencyModalOpen, setIsCreateCurrencyModalOpen] =
    useState(false)
  const closeCreateCurrencyModalHandler = () =>
    setIsCreateCurrencyModalOpen(false)
  const closeUpdateCurrencyModalHandler = () => setUpdatingCurrency(null)

  if (!currencyRouteData || !adminRouteData) {
    return null
  }

  const { currencies } = currencyRouteData
  const { user } = adminRouteData

  if (!currencies || !user) {
    return null
  }

  const copyCurrencyIdHandelr = (currencyId: string) => {
    navigator.clipboard.writeText(currencyId)
  }

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

      router.invalidate()
    },
    onError: (err) => {
      console.error(`Failed to delete currency. Error: ${err}`)
    }
  })

  return (
    <>
      <Modal
        open={isCreateCurrencyModalOpen}
        onClose={closeCreateCurrencyModalHandler}
      >
        <CreateCurrencyForm
          onCLose={closeCreateCurrencyModalHandler}
          mode='create'
        />
      </Modal>

      <Modal
        open={!!updatingCurrency}
        onClose={closeUpdateCurrencyModalHandler}
      >
        {updatingCurrency && (
          <CreateCurrencyForm
            onCLose={closeUpdateCurrencyModalHandler}
            mode='edit'
            initialData={updatingCurrency}
          />
        )}
      </Modal>
      <div className={styles.currencies}>
        <div className={styles.currencies_header}>
          <Text variant='subheader-3'>Список валют</Text>
          <Button
            size='m'
            view='flat-action'
            onClick={() => setIsCreateCurrencyModalOpen(true)}
          >
            Добавить
          </Button>
        </div>

        <div className={styles['currencies-list']}>
          {currencies.length === 0 ? (
            <Text
              variant='body-2'
              color='secondary'
              className={styles['currencies-list__emplty']}
            >
              Список валют пуст
            </Text>
          ) : (
            currencies.map((currency) => (
              <div key={currency.id} className={styles.currency}>
                <div className={styles['currency_id-block']}>
                  <Text variant='caption-2' color='secondary'>
                    {currency.id}
                  </Text>
                  <Copy onClick={() => copyCurrencyIdHandelr(currency.id)} />
                </div>

                <div className={styles['currency-data']}>
                  <div className={styles['currency-text-block']}>
                    <Text color='secondary'>Full name</Text>
                    <Text variant='body-2'>{currency.fullname}</Text>
                  </div>
                  <div className={styles['currency-text-block']}>
                    <Text color='secondary'>Short name</Text>
                    <Text variant='body-2'>{currency.shortname}</Text>
                  </div>
                  <div className={styles.currency_actions}>
                    <Tooltip content={'Редактировать валюту'} openDelay={200}>
                      <Button
                        size='m'
                        view='flat'
                        disabled={!iaAvailableForAdmin(user.role)}
                        onClick={() => setUpdatingCurrency(currency)}
                      >
                        <Icon data={Pencil} size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content={'Удалить валюту'} openDelay={200}>
                      <Button
                        size='m'
                        view='flat-danger'
                        disabled={!iaAvailableForAdmin(user.role)}
                        onClick={() => deleteCurrency({ id: currency.id })}
                      >
                        <Icon data={TrashBin} size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
