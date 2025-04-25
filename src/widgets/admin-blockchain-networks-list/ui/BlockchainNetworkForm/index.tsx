import React, { useState } from 'react'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  Button,
  Select,
  SelectOption,
  Text,
  TextInput
} from '@gravity-ui/uikit'
import { queryClient } from '@/app/main'
import {
  AvailableBlockchainNetworks,
  BlockchainNetwork,
  createBlockchainNetworkApi,
  CreateBlockchainNetworkErrorResposnse,
  CreateBlockchainNetworkPayload,
  CreateBlockchainNetworkSuccessResposnse,
  updateBlockchainNetworkApi,
  UpdateBlockchainNetworkBody,
  UpdateBlockchainNetworkErrorResponse,
  UpdateBlockchainNetworkParams,
  UpdateBlockchainNetworkSuccessResposnse
} from '@/shared/api/v1/blockchainNetworksApi'

import styles from './styles.module.css'

interface BlockchainNetworkFormProps {
  mode: 'create' | 'edit'
  availableBlockchainNetworks: AvailableBlockchainNetworks
  initialData?: BlockchainNetwork
  onClose: () => void
}

export function BlockchainNetworkForm({
  mode,
  availableBlockchainNetworks,
  initialData,
  onClose
}: BlockchainNetworkFormProps) {
  const [blockchainName, setBlockchainName] = useState<string[]>([
    initialData?.name || ''
  ])
  const selectBlockchainNameOptions: SelectOption[] =
    availableBlockchainNetworks?.map((blockchain) => ({
      value: blockchain,
      content: blockchain
    }))
  const [tokenStandart, setTokenStandart] = useState(
    initialData?.tokenStandart || ''
  )
  const [formError, setFormError] = useState<string | null>(null)

  const router = useRouter()

  const { mutate: createBlockchainNetrwork, isPending: isCreating } =
    useMutation<
      CreateBlockchainNetworkSuccessResposnse,
      AxiosError<CreateBlockchainNetworkErrorResposnse>,
      CreateBlockchainNetworkPayload
    >({
      mutationFn: createBlockchainNetworkApi,
      onSuccess: () => {
        handleSuccess()
      },
      onError: (err) => {
        handleError(err)
      }
    })

  const { mutate: updateBlockchainNetrwork, isPending: isUpdating } =
    useMutation<
      UpdateBlockchainNetworkSuccessResposnse,
      AxiosError<UpdateBlockchainNetworkErrorResponse>,
      {
        params: UpdateBlockchainNetworkParams
        body: UpdateBlockchainNetworkBody
      }
    >({
      mutationFn: updateBlockchainNetworkApi,
      onSuccess: () => {
        handleSuccess()

        queryClient.invalidateQueries({
          queryKey: ['admin', 'cryptoAssets', 'getAll']
        })
      },
      onError: (err) => {
        handleError(err)
      }
    })

  const handleSuccess = () => {
    setFormError(null)

    queryClient.invalidateQueries({
      queryKey: ['admin', 'blockchainNetworks', 'getAll']
    })

    router.invalidate().then(() => {
      onClose()
    })
  }

  const handleError = (
    err: AxiosError<
      CreateBlockchainNetworkErrorResposnse,
      UpdateBlockchainNetworkErrorResponse
    >
  ) => {
    if (err.response?.data.type === 'ALREADY_EXISTS') {
      setFormError(
        `Сеть "${blockchainName} – ${tokenStandart}" уже существует!`
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!blockchainName[0] || !tokenStandart.trim()) {
      return
    }

    if (mode === 'create') {
      createBlockchainNetrwork({
        name: blockchainName[0],
        tokenStandart
      })
    }

    if (mode === 'edit' && initialData) {
      updateBlockchainNetrwork({
        params: { id: initialData.id },
        body: {
          name: blockchainName[0],
          tokenStandart: tokenStandart.trim()
        }
      })
    }
  }

  return (
    <div className={styles['create-blockchain-network-container']}>
      <Text variant='header-1'>
        {mode === 'create' ? 'Создание' : 'Редактирование'} блокчейн сети
      </Text>

      <Text variant='body-2' color='secondary'>
        На данный момент сервис поддерживает работу со следующими сетями:{' '}
        <Text variant='body-2' color='misc-heavy'>
          {availableBlockchainNetworks?.join(', ')}
        </Text>
      </Text>

      <form onSubmit={handleSubmit}>
        <div className={styles['create-blockchain-network-content']}>
          <div className={styles['create-blockchain-network_form-block']}>
            <Text variant='body-2'>
              Название сети{' '}
              {initialData && (
                <Text variant='body-2' color='secondary'>
                  (текущее: {initialData.name})
                </Text>
              )}
            </Text>
            <Select
              size='l'
              options={selectBlockchainNameOptions}
              placeholder={'Выберите блокчейн сеть'}
              value={blockchainName}
              onUpdate={(value) => setBlockchainName(value)}
            />
          </div>

          <div className={styles['create-blockchain-network_form-block']}>
            <Text variant='body-2'>
              Стандарт токена{' '}
              {initialData && (
                <Text variant='body-2' color='secondary'>
                  (текущее: {initialData.tokenStandart})
                </Text>
              )}
            </Text>
            <TextInput
              size='l'
              placeholder='К примеру ERC-20'
              disabled={isCreating || isUpdating}
              hasClear
              value={tokenStandart}
              onChange={(e) => {
                setFormError(null)
                setTokenStandart(e.target.value)
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
            {mode === 'create' ? 'Создать' : 'Обновить'} блокчейн сеть
          </Button>
        </div>
      </form>
    </div>
  )
}
