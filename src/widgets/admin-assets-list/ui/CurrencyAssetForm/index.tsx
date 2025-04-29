import { useCallback, useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  Button,
  SegmentedRadioGroup,
  Select,
  SelectProps,
  Text
} from '@gravity-ui/uikit'
import { queryClient } from '@/app/main'
import { Route as AdminRoute } from '@/routes/admin/route'
import { CurrencyAssetCard } from '@/shared/ui/CurrencyAsset'
import {
  createCryptoAssetApi,
  CreateCryptoAssetErrorResponse,
  CreateCryptoAssetPayload,
  CreateCryptoAssetSuccessResponse,
  CryptoAsset,
  FiatAsset
} from '@/shared/api/v1/cryptoAssetApi'
import { Currency } from '@/shared/api/v1/currencyApi'
import { BlockchainNetwork } from '@/shared/api/v1/blockchainNetworksApi'

import styles from './styles.module.css'

interface CurrencyAssetFormProps {
  onClose: () => void
}

type DraftAsset =
  | (CryptoAsset & { assetType: 'crypto' })
  | (FiatAsset & { assetType: 'fiat' })

export function CurrencyAssetForm({ onClose }: CurrencyAssetFormProps) {
  const adminRouteData = AdminRoute.useLoaderData()

  const router = useRouter()

  if (!adminRouteData) {
    return null
  }

  const currencies = queryClient.getQueryData<Currency[]>([
    'admin',
    'currencies',
    'getAll'
  ])
  const blockchainNetworks = queryClient.getQueryData<BlockchainNetwork[]>([
    'admin',
    'blockchainNetworks',
    'getAll'
  ])

  // Заглушка
  const fiatProviders = [
    {
      id: '1',
      type: 'BANK',
      name: 'SBER',
      createdAt: ''
    },
    {
      id: '2',
      type: 'BANK',
      name: 'VTB',
      createdAt: ''
    }
  ]

  if (!currencies || !blockchainNetworks || !fiatProviders) {
    return null
  }

  const [assetType, setAssetType] = useState<DraftAsset['assetType']>('crypto')

  const [selectCurrencyId, setSelectCurrencyId] = useState<string[]>([])
  const updateCurrencyHandler = (value: string[]) => {
    setSelectCurrencyId(value)
    setFormError(null)
  }

  const [selectBlockchainId, setSelectBlockchainId] = useState<string[]>([])
  const updateBlockchainHandler = (value: string[]) => {
    setSelectBlockchainId(value)
    setFormError(null)
  }

  const [selectFiatProviderId, setSelectFiatProviderId] = useState<string[]>([])
  const updateFiatProviderHandler = (value: string[]) => {
    setSelectFiatProviderId(value)
    setFormError(null)
  }

  const renderSelectOption: SelectProps['renderSelectedOption'] = (option) => (
    <Text variant='body-2'>{option.children}</Text>
  )

  const handleAssetTypeChange = useCallback(
    (value: DraftAsset['assetType']) => {
      setAssetType(value)
      setSelectCurrencyId([])
      setSelectBlockchainId([])
      setSelectFiatProviderId([])
      setFormError(null)
    },
    []
  )

  const draftAsset: DraftAsset | null = useMemo(() => {
    const currencyId = selectCurrencyId[0]
    const blockchainNetworkId = selectBlockchainId[0]
    const fiatProviderId = selectFiatProviderId[0]
    let newDraft: DraftAsset | null = null

    if (currencyId) {
      const currency = currencies.find((c) => c.id === currencyId)

      if (!currency) return null

      if (assetType === 'crypto' && blockchainNetworkId) {
        const blockchainNetwork = blockchainNetworks.find(
          (b) => b.id === blockchainNetworkId
        )

        if (blockchainNetwork) {
          newDraft = {
            assetType: 'crypto',
            id: 'draft-crypto-asset',
            currencyId,
            currency,
            blockchainNetworkId,
            blockchainNetwork,
            createdAt: new Date().toISOString()
          }
        }
      } else if (assetType === 'fiat' && fiatProviderId) {
        const fiatProvider = fiatProviders.find((f) => f.id === fiatProviderId)
        if (fiatProvider) {
          newDraft = {
            assetType: 'fiat',
            id: 'draft-fiat-asset',
            currencyId,
            currency,
            fiatProviderId,
            fiatProvider,
            createdAt: new Date().toISOString()
          }
        }
      }
    }

    return newDraft
  }, [
    assetType,
    selectCurrencyId,
    selectBlockchainId,
    selectFiatProviderId,
    currencies,
    blockchainNetworks,
    fiatProviders
  ])

  const [formError, setFormError] = useState<string | null>(null)

  const { mutate: createCryptoAsset, isPending: isCreatingCryptoAsset } =
    useMutation<
      CreateCryptoAssetSuccessResponse,
      AxiosError<CreateCryptoAssetErrorResponse>,
      CreateCryptoAssetPayload
    >({
      mutationFn: createCryptoAssetApi,
      onSuccess: () => {
        setFormError(null)

        queryClient.invalidateQueries({
          queryKey: ['admin', 'cryptoAssets', 'getAll']
        })

        router.invalidate().then(() => onClose())
      },
      onError: (err: AxiosError<CreateCryptoAssetErrorResponse>) => {
        if (err.response?.data.type === 'ALREADY_EXISTS') {
          setFormError('Такой валютный актив уже существует!')
        }
      }
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!draftAsset || isCreatingCryptoAsset) {
      return
    }

    setFormError(null)

    if (draftAsset.assetType === 'crypto') {
      const { currencyId, blockchainNetworkId } = draftAsset as CryptoAsset

      createCryptoAsset({ currencyId, blockchainNetworkId })
    }

    if (draftAsset.assetType === 'fiat') {
      // логика для фиата
      onClose()
    }
  }

  return (
    <div className={styles['currency-asset-form_container']}>
      <Text variant='header-1'>Создание валютного актива</Text>

      <form onSubmit={handleSubmit}>
        <div className={styles['currency-asset-form_content']}>
          <div className={styles['currency-asset-form_block']}>
            <Text variant='body-2'>Выберите тип актива</Text>
            <SegmentedRadioGroup
              size='m'
              disabled={isCreatingCryptoAsset}
              onUpdate={handleAssetTypeChange}
              defaultValue='crypto'
            >
              <SegmentedRadioGroup.Option value='crypto'>
                Криптоактив
              </SegmentedRadioGroup.Option>
              <SegmentedRadioGroup.Option value='fiat'>
                Фиатный актив
              </SegmentedRadioGroup.Option>
            </SegmentedRadioGroup>
          </div>

          <div className={styles['currency-asset-form_block']}>
            <Text variant='body-2'>Выберите валюту</Text>
            <Select
              size='l'
              value={selectCurrencyId}
              placeholder='Выберите валюту'
              onUpdate={updateCurrencyHandler}
              renderSelectedOption={renderSelectOption}
            >
              {currencies.map((currency) => (
                <Select.Option value={currency.id}>
                  {`${currency.fullname} – ${currency.shortname}`}
                </Select.Option>
              ))}
            </Select>
          </div>

          {assetType === 'crypto' && (
            <div className={styles['currency-asset-form_block']}>
              <Text variant='body-2'>Выберите блокчейн сеть</Text>
              <Select
                size='l'
                value={selectBlockchainId}
                placeholder='Выберите блокчейн сеть'
                onUpdate={updateBlockchainHandler}
                renderSelectedOption={renderSelectOption}
              >
                {blockchainNetworks.map((blockchain) => (
                  <Select.Option value={blockchain.id}>
                    {`${blockchain.name} – ${blockchain.tokenStandart}`}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {assetType === 'fiat' && (
            <div className={styles['currency-asset-form_block']}>
              <Text variant='body-2'>Выберите фиатный провайдер</Text>
              <Select
                size='l'
                value={selectFiatProviderId}
                placeholder='Выберите фиатный провайдер'
                onUpdate={updateFiatProviderHandler}
                renderSelectedOption={renderSelectOption}
              >
                {fiatProviders.map((fiatProvider) => (
                  <Select.Option value={fiatProvider.id}>
                    {`${fiatProvider.type} – ${fiatProvider.name}`}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {draftAsset && (
            <div className={styles['currency-asset-form_block']}>
              <Text variant='body-2'>Такой валютный актив будет создан</Text>
              {draftAsset && draftAsset.assetType === 'crypto' && (
                <CurrencyAssetCard
                  assetType={draftAsset.assetType}
                  asset={draftAsset}
                />
              )}

              {draftAsset && draftAsset.assetType === 'fiat' && (
                <CurrencyAssetCard
                  assetType={draftAsset.assetType}
                  asset={draftAsset}
                />
              )}
            </div>
          )}

          {formError && <Text color='danger'>{formError}</Text>}

          <Button
            type='submit'
            size='l'
            view='action'
            className={styles['currency-asset-form_action-btn']}
            disabled={!draftAsset || isCreatingCryptoAsset}
          >
            Создать валютный актив
          </Button>
        </div>
      </form>
    </div>
  )
}
