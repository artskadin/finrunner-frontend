import { useCallback, useState } from 'react'
import { Button, Modal, Text } from '@gravity-ui/uikit'
import { Route as CurrencyRoute } from '@/routes/admin/currencies'
import { Route as AdminRoute } from '@/routes/admin/route'
import { BlockchainNetwork } from '@/shared/api/v1/blockchainNetworksApi'
import { CurrencyEntityList } from '@/shared/ui/CurrencyEntityList'
import { BlockchainNetworkItem } from './BlockchainNetworkItem'
import { BlockchainNetworkForm } from './BlockchainNetworkForm'
import { DeleteBlockchainMetworkForm } from './DeleteBlockchainNetworkForm'

import styles from './styles.module.css'

export function AdminBlockchainNetworkWidget() {
  const currencyRouteData = CurrencyRoute.useLoaderData()
  const adminRouteData = AdminRoute.useLoaderData()

  const [
    isCreateBlockchainNetworkModalOpen,
    setIsCreateBlockchainNetworkModalOpen
  ] = useState(false)
  const closeCreateBlockchainNetworkModalHandler = () =>
    setIsCreateBlockchainNetworkModalOpen(false)

  const [updatingBlockchainNetworks, setUpdatingBlockchainNetworks] =
    useState<BlockchainNetwork | null>(null)
  const closeUpdateBlockchainNetworksModalHandler = () =>
    setUpdatingBlockchainNetworks(null)

  const [deletingBlockchainNetworks, setDeletingBlockchainNetworks] =
    useState<BlockchainNetwork | null>(null)
  const closeDeleteBlockchainNetworksModalHandler = () =>
    setDeletingBlockchainNetworks(null)

  const copyBlockchainNetworkIdHandler = useCallback(
    (blockchainNetworkId: string) => {
      navigator.clipboard.writeText(blockchainNetworkId)
    },
    []
  )

  if (!currencyRouteData || !adminRouteData) {
    return null
  }

  const { availableBlockchainNetworks, blockchainNetworks } = currencyRouteData
  const { user } = adminRouteData

  if (!availableBlockchainNetworks || !blockchainNetworks || !user) {
    return null
  }

  const handleAddBlockchainNetworkClick = useCallback(
    () => setIsCreateBlockchainNetworkModalOpen(true),
    []
  )

  const handleEditBlockchainNetworkClick = useCallback(
    (blockchainNetwork: BlockchainNetwork) =>
      setUpdatingBlockchainNetworks(blockchainNetwork),
    []
  )
  const handleDeleteBlockchainNetworkClick = useCallback(
    (blockchainNetwork: BlockchainNetwork) =>
      setDeletingBlockchainNetworks(blockchainNetwork),
    []
  )

  const renderHeader = useCallback(
    ({ totalCount }: { totalCount: number }) => (
      <div className={styles['blockchain-networks_header']}>
        <Text variant='subheader-3'>
          Список блокчейн сетей{' '}
          <Text variant='subheader-3' color='secondary'>
            ({totalCount})
          </Text>
        </Text>

        <Button
          size='m'
          view='flat-action'
          onClick={handleAddBlockchainNetworkClick}
        >
          Добавить
        </Button>
      </div>
    ),
    [handleAddBlockchainNetworkClick]
  )

  const renderItem = useCallback(
    (blockchainNetwork: BlockchainNetwork) => (
      <BlockchainNetworkItem
        blockchainNetwork={blockchainNetwork}
        user={user}
        onCopy={copyBlockchainNetworkIdHandler}
        onEdit={handleEditBlockchainNetworkClick}
        onDelete={handleDeleteBlockchainNetworkClick}
      />
    ),
    []
  )

  return (
    <>
      <Modal
        open={isCreateBlockchainNetworkModalOpen}
        onClose={closeCreateBlockchainNetworkModalHandler}
      >
        <BlockchainNetworkForm
          mode='create'
          availableBlockchainNetworks={availableBlockchainNetworks}
          onClose={closeCreateBlockchainNetworkModalHandler}
        />
      </Modal>

      <Modal
        open={!!updatingBlockchainNetworks}
        onClose={closeUpdateBlockchainNetworksModalHandler}
      >
        {updatingBlockchainNetworks && (
          <BlockchainNetworkForm
            mode='edit'
            availableBlockchainNetworks={availableBlockchainNetworks}
            initialData={updatingBlockchainNetworks}
            onClose={closeUpdateBlockchainNetworksModalHandler}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingBlockchainNetworks}
        onClose={closeDeleteBlockchainNetworksModalHandler}
      >
        {deletingBlockchainNetworks && (
          <DeleteBlockchainMetworkForm
            blockchainNetwork={deletingBlockchainNetworks}
            onClose={closeDeleteBlockchainNetworksModalHandler}
          />
        )}
      </Modal>

      <CurrencyEntityList<BlockchainNetwork, { totalCount: number }>
        items={blockchainNetworks}
        getItemId={(item) => item.id}
        renderHeader={() =>
          renderHeader({ totalCount: blockchainNetworks.length })
        }
        renderItem={renderItem}
        emptyPlaceholder={
          <Text variant='body-2' color='secondary'>
            Список блокчейн сетей пуст
          </Text>
        }
      />
    </>
  )
}
