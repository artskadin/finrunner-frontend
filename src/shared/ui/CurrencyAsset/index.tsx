import React from 'react'
import { Text } from '@gravity-ui/uikit'
import { BlockIcon } from '@blockicon/react'
import { CryptoAsset, FiatAsset } from '@/shared/api/v1/cryptoAssetApi'

import styles from './styles.module.css'

export type CurrencyAssetCardProps =
  | { assetType: 'crypto'; asset: CryptoAsset }
  | { assetType: 'fiat'; asset: FiatAsset }

const TOKEN_NAME_MAP: Record<string, string> = {
  SOL: 'solana'
}

function mapToBlockiconAssetName(
  shortname: string | null | undefined
): string | null {
  if (!shortname) {
    return null
  }

  return TOKEN_NAME_MAP[shortname] || shortname
}

export function NonMemoCurrencyAssetCard({
  assetType,
  asset
}: CurrencyAssetCardProps) {
  let AssetIcon
  let assetFullName
  let assetShortName
  let tokenStandart

  if (assetType === 'crypto') {
    assetShortName = mapToBlockiconAssetName(asset.currency?.shortname)
    assetFullName = asset.currency?.fullname
    tokenStandart = asset.blockchainNetwork?.tokenStandart

    if (assetShortName) {
      AssetIcon = (
        <BlockIcon category='token' asset={assetShortName as any} size='lg' />
      )
    }
  }

  return (
    <div className={styles['crypto-asset-card_container']}>
      {assetType === 'crypto' && (
        <>
          <div>{AssetIcon}</div>
          <div className={styles['crypto-asset-card_currency']}>
            <Text variant='body-2'>
              {assetFullName} <Text variant='body-2'>{tokenStandart}</Text>
            </Text>
            <Text variant='body-2' color='secondary'>
              {asset.currency?.shortname}
            </Text>
          </div>
        </>
      )}
    </div>
  )
}

export const CurrencyAssetCard = React.memo(NonMemoCurrencyAssetCard)
