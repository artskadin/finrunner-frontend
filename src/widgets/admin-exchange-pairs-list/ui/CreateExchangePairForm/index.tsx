import { AxiosError } from 'axios'
import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Icon,
  Select,
  SelectProps,
  Text,
  TextInput
} from '@gravity-ui/uikit'
import { ArrowRight } from '@gravity-ui/icons'
import { queryClient } from '@/app/main'
import { useCryptoAssetsQuery } from '@/widgets/admin-assets-list'
import { CurrencyAssetCard } from '@/shared/ui/CurrencyAsset'
import { CryptoAsset } from '@/shared/api/v1/cryptoAssetApi'
import {
  createExchangePairApi,
  CreateExchangePairErrorResponse,
  CreateExchangePairPayload,
  CreateExchangePairSuccessResponse
} from '@/shared/api/v1/exchangePairsApi'
import { markupPercentageSchema } from '../../utils/markupPercentageSchema'

import styles from './styles.module.css'

interface CreateExchangePairFormProps {
  onClose: () => void
}

const renderSelectedOption: SelectProps['renderSelectedOption'] = (option) => {
  const asset = option.data.asset as CryptoAsset

  if (!asset.currency || !asset.blockchainNetwork) {
    return <Text variant='body-2'>{option.value}</Text>
  }

  return (
    <Text variant='body-2'>
      {asset.currency.fullname} {asset.currency.shortname} –{' '}
      {asset.blockchainNetwork.tokenStandart}
    </Text>
  )
}

const getOptionHeight: SelectProps['getOptionHeight'] = (option) =>
  option.data.height

export function CreateExchangePairForm({
  onClose
}: CreateExchangePairFormProps) {
  const { data: cryptoAssets } = useCryptoAssetsQuery()

  const [selectedFromAssetIds, setSelectedFromAssetIds] = useState<string[]>([])
  const updateFromAssetHandler = (value: string[]) => {
    setFormError(null)
    setSelectedFromAssetIds(value)
  }

  const [selectedToAssetIds, setSelectedToAssetIds] = useState<string[]>([])
  const updateToAssetHandler = (value: string[]) => {
    setFormError(null)
    setSelectedToAssetIds(value)
  }

  const [markupPercentage, setMerkupPercentage] = useState<string>('')
  const handleInputUpdate = (value: string) => {
    setFormError(null)
    setMerkupPercentage(value)
  }

  const [formError, setFormError] = useState<string | null>(null)

  const selectedFromAsset = useMemo(() => {
    const selectedAssetId = selectedFromAssetIds[0]
    return cryptoAssets?.find((asset) => asset.id === selectedAssetId)
  }, [selectedFromAssetIds, cryptoAssets])

  const selectedToAsset = useMemo(() => {
    const selectedAssetId = selectedToAssetIds[0]
    return cryptoAssets?.find((asset) => asset.id === selectedAssetId)
  }, [selectedToAssetIds, cryptoAssets])

  const { mutate: craateExchangePair, isPending: isCreatingExchangePair } =
    useMutation<
      CreateExchangePairSuccessResponse,
      AxiosError<CreateExchangePairErrorResponse>,
      CreateExchangePairPayload
    >({
      mutationFn: createExchangePairApi,
      onSuccess: () => {
        setFormError(null)

        queryClient.invalidateQueries({
          queryKey: ['admin', 'exchangePairs', 'getAll']
        })

        onClose()
      },
      onError: (err: AxiosError<CreateExchangePairErrorResponse>) => {
        if (err.response?.data.type === 'ALREADY_EXISTS') {
          setFormError('Такая обменная пара уже существует')
        }
      }
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFromAsset || !selectedToAsset) {
      return
    }

    const checkecMarkupPercentage =
      markupPercentageSchema.safeParse(markupPercentage)

    if (markupPercentage && !checkecMarkupPercentage.success) {
      setFormError(
        'Неверный формат комиссии: должна быть десятичная дробь (к примеру, 0.5)'
      )
      return
    }

    const payload: CreateExchangePairPayload = {
      fromCryptoAssetId: selectedFromAsset.id,
      toCryptoAssetId: selectedToAsset.id,
      markupPercentage: markupPercentage || '0'
    }

    craateExchangePair(payload)
  }

  return (
    <div className={styles['exchange-pair-form_container']}>
      <Text variant='header-1'>Создание обменной пары</Text>

      {cryptoAssets && (
        <form
          onSubmit={handleSubmit}
          className={styles['exchange-pair-form_content']}
        >
          <div className={styles['exchange-pair-form_assets']}>
            <div className={styles['exchange-pair-form_asset']}>
              <Select
                placeholder='Входной актив'
                size='l'
                value={selectedFromAssetIds}
                onUpdate={updateFromAssetHandler}
                renderSelectedOption={renderSelectedOption}
                getOptionHeight={getOptionHeight}
              >
                {cryptoAssets.map((asset) => (
                  <Select.Option value={asset.id} data={{ height: 55, asset }}>
                    <CurrencyAssetCard assetType='crypto' asset={asset} />
                  </Select.Option>
                ))}
              </Select>

              {selectedFromAsset && (
                <CurrencyAssetCard
                  assetType='crypto'
                  asset={selectedFromAsset}
                />
              )}
            </div>

            <Icon
              data={ArrowRight}
              size={24}
              className={styles['arrow-color']}
            />

            <div className={styles['exchange-pair-form_asset']}>
              <Select
                placeholder='Выходной актив'
                size='l'
                value={selectedToAssetIds}
                onUpdate={updateToAssetHandler}
                renderSelectedOption={renderSelectedOption}
                getOptionHeight={getOptionHeight}
              >
                {cryptoAssets.map((asset) => (
                  <Select.Option value={asset.id} data={{ height: 55, asset }}>
                    <CurrencyAssetCard assetType='crypto' asset={asset} />
                  </Select.Option>
                ))}
              </Select>

              {selectedToAsset && (
                <CurrencyAssetCard assetType='crypto' asset={selectedToAsset} />
              )}
            </div>
          </div>

          <div className={styles['exchange-pair-form_markup-percentage']}>
            <Text variant='body-2'>
              Задайте начальную комиссию{' '}
              <Text variant='body-2' color='secondary'>
                (по умолчанию 0%)
              </Text>
            </Text>
            <TextInput
              size='l'
              placeholder='К примеру, 1.5'
              value={markupPercentage}
              onUpdate={handleInputUpdate}
              hasClear
              className={styles['exchange-pair-form_markup-percentage_input']}
            />
          </div>

          {formError && (
            <Text
              variant='body-2'
              color='danger'
              className={styles['exchange-pair-form_error']}
            >
              {formError}
            </Text>
          )}

          <Button
            size='l'
            view='action'
            type='submit'
            className={styles['exchange-pair-form_action-btn']}
            disabled={
              isCreatingExchangePair || !selectedFromAsset || !selectedToAsset
            }
          >
            Создать обменную пару
          </Button>
        </form>
      )}
    </div>
  )
}
