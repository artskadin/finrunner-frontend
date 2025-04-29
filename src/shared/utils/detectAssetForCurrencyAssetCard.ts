import { ExchangePair } from '../api/v1/exchangePairsApi'
import { CurrencyAssetCardProps } from '../ui/CurrencyAsset'

export function detectAssetForCurrencyAssetCard({
  assetSide,
  pair
}: {
  assetSide: 'from' | 'to'
  pair: ExchangePair
}): CurrencyAssetCardProps | null {
  if (assetSide === 'from') {
    if (pair.fromCryptoAsset) {
      return { assetType: 'crypto', asset: pair.fromCryptoAsset }
    }

    if (pair.fromFiatAsset) {
      //TODO Исправить когда будет Fiat
      return { assetType: 'fiat', asset: pair.fromFiatAsset as any }
    }
  }

  if (assetSide === 'to') {
    if (pair.toCryptoAsset) {
      return { assetType: 'crypto', asset: pair.toCryptoAsset }
    }

    if (pair.toFiatAsset) {
      //TODO Исправить когда будет Fiat
      return { assetType: 'fiat', asset: pair.toFiatAsset as any }
    }
  }

  return null
}
