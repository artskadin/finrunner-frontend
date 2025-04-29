import React from 'react'
import { Button, Icon, Popover, Tooltip } from '@gravity-ui/uikit'
import { TrashBin } from '@gravity-ui/icons'
import { CurrencyAssetCardProps } from '@/shared/ui/CurrencyAsset'
import { User } from '@/shared/api/user'
import { CryptoAssetPopoverInfo } from './CryptoAssetPopoverInfo'
import { isAvailableForAdmin } from '@/shared/utils/checkUserRules'

import styles from './styles.module.css'

interface CurrencyAssetWrapperProps {
  children: React.ReactElement
  assetData: CurrencyAssetCardProps
  user: User
  onDelete: (asset: CurrencyAssetCardProps) => void
}

function NonMemoCurrencyAssetWrapper({
  children,
  assetData,
  user,
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
          <Button
            size='m'
            view='flat-danger'
            onClick={handleDelete}
            disabled={!isAvailableForAdmin(user.role)}
          >
            <Icon data={TrashBin} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export const CurrencyAssetWrapper = React.memo(NonMemoCurrencyAssetWrapper)
