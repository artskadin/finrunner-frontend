import { useState } from 'react'
import { AxiosError } from 'axios'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button, Text, TextInput } from '@gravity-ui/uikit'
import {
  createCurrencyApi,
  CreateCurrencyErrorResponse,
  CreateCurrencyPayload,
  CreateCurrencySuccessResponse,
  Currency,
  updateCurrencyApi,
  UpdateCurrencyBody,
  UpdateCurrencyErrorResponse,
  UpdateCurrencyParams,
  UpdateCurrencySuccessResponse
} from '@/shared/api/v1/currency'
import { queryClient } from '@/app/main'

import styles from './styles.module.css'

interface CreateCurrencyFormProps {
  mode: 'create' | 'edit'
  initialData?: Currency
  onCLose: () => void
}

export function CurrencyForm({
  mode,
  initialData,
  onCLose
}: CreateCurrencyFormProps) {
  const [fullname, setFullname] = useState(initialData?.fullname || '')
  const [shortname, setShortname] = useState(initialData?.shortname || '')
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()

  const { mutate: createCurrency, isPending: isCreating } = useMutation<
    CreateCurrencySuccessResponse,
    AxiosError<CreateCurrencyErrorResponse>,
    CreateCurrencyPayload
  >({
    mutationFn: createCurrencyApi,
    onSuccess: () => {
      handleSuccess()
    },
    onError: (err) => {
      handleError(err)
    }
  })

  const { mutate: updateCurrency, isPending: isUpdating } = useMutation<
    UpdateCurrencySuccessResponse,
    AxiosError<UpdateCurrencyErrorResponse>,
    { params: UpdateCurrencyParams; body: UpdateCurrencyBody }
  >({
    mutationFn: updateCurrencyApi,
    onSuccess: () => {
      handleSuccess()
    },
    onError: (err) => {
      handleError(err)
    }
  })

  const handleSuccess = () => {
    setFormError(null)

    queryClient.invalidateQueries({
      queryKey: ['admin', 'currencies', 'getAll']
    })

    router.invalidate().then(() => {
      onCLose()
    })
  }

  const handleError = (
    err: AxiosError<CreateCurrencyErrorResponse | UpdateCurrencyErrorResponse>
  ) => {
    if (err.response?.data.type === 'ALREADY_EXISTS') {
      const isFullnameExist = err.response?.data.message.includes('fullname')
      setFormError(
        `Валюта ${isFullnameExist ? fullname : shortname} уже существует!`
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullname.trim() || !shortname.trim()) {
      return
    }

    if (mode === 'create') {
      createCurrency({
        fullname: fullname.trim(),
        shortname: shortname.trim().toUpperCase()
      })
    }

    if (mode === 'edit' && initialData) {
      updateCurrency({
        params: { id: initialData?.id },
        body: {
          fullname: fullname.trim(),
          shortname: shortname.trim().toUpperCase()
        }
      })
    }
  }

  return (
    <div className={styles['create-currency-container']}>
      <Text variant='header-1'>
        {mode === 'create' ? 'Создание' : 'Редактирование'} валюты
      </Text>

      <form onSubmit={handleSubmit}>
        <div className={styles['create-currency-content']}>
          <div className={styles['create-currency_form-block']}>
            <Text variant='body-2'>Полное имя</Text>
            <TextInput
              size='l'
              placeholder='К примеру Ethereum'
              disabled={isCreating || isUpdating}
              autoFocus
              hasClear
              value={fullname}
              onChange={(e) => {
                setFormError(null)
                setFullname(e.target.value)
              }}
            />
          </div>

          <div className={styles['create-currency_form-block']}>
            <Text variant='body-2'>Сокрашенное имя</Text>
            <TextInput
              size='l'
              placeholder='К примеру ETH'
              disabled={isCreating || isUpdating}
              hasClear
              value={shortname}
              onChange={(e) => {
                setFormError(null)
                setShortname(e.target.value)
              }}
            />
          </div>

          {formError && <Text color='danger'>{formError}</Text>}

          <Button
            type='submit'
            size='l'
            view='action'
            disabled={isCreating || isUpdating}
          >
            {mode === 'create' ? 'Создать' : 'Обновить'} валюту
          </Button>
        </div>
      </form>
    </div>
  )
}
