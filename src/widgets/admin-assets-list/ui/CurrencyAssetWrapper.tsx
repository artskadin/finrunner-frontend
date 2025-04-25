import React from 'react'
import { Button, Icon, Popover, Tooltip } from '@gravity-ui/uikit'
import { TrashBin } from '@gravity-ui/icons'
import { CurrencyAssetCardProps } from '@/shared/ui/CurrencyAsset'
import { CryptoAssetPopoverInfo } from './CryptoAssetPopoverInfo'

import styles from './styles.module.css'

interface CurrencyAssetWrapperProps {
  children: React.ReactElement
  assetData: CurrencyAssetCardProps
  onEdit: (assetId: string) => void
  onDelete: (asset: CurrencyAssetCardProps) => void
}

function NonMemoCurrencyAssetWrapper({
  children,
  assetData,
  onDelete
}: CurrencyAssetWrapperProps) {
  const handleDelete = () => {
    onDelete(assetData)
  }

  return (
    <div className={styles['admin-assets-wrapper_container']}>
      <div className={styles['admin-assets-wrapper_asset']}>
        <Popover
          hasArrow
          trigger='click'
          content={
            assetData.assetType === 'crypto' ? (
              <CryptoAssetPopoverInfo asset={assetData.asset} />
            ) : (
              <div>Fiat Provider coming soon</div>
            )
          }
        >
          <div>{children}</div>
        </Popover>
      </div>

      <div>
        <Tooltip content={'Удалить валютный актив'} openDelay={200}>
          <Button size='m' view='flat-danger' onClick={handleDelete}>
            <Icon data={TrashBin} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export const CurrencyAssetWrapper = React.memo(NonMemoCurrencyAssetWrapper)
