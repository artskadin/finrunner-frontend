import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Modal, Text } from '@gravity-ui/uikit'
import { Route as AdminRoute } from '@/routes/admin/route'
import {
  BlockchainNetwork,
  getAvailableBlockchainNetworksApi,
  getBlockchainNetworksApi
} from '@/shared/api/v1/blockchainNetworksApi'
import { CurrencyEntityList } from '@/shared/ui/CurrencyEntityList'
import { isAvailableForAdmin } from '@/shared/utils/checkUserRules'
import { BlockchainNetworkItem } from './BlockchainNetworkItem'
import { BlockchainNetworkForm } from './BlockchainNetworkForm'
import { DeleteBlockchainMetworkForm } from './DeleteBlockchainNetworkForm'

import styles from './styles.module.css'

export function AdminBlockchainNetworkWidget() {
  const adminRouteData = AdminRoute.useLoaderData()

  const blockchainNetworksQuery = useQuery({
    queryKey: ['admin', 'blockchainNetworks', 'getAll'],
    queryFn: getBlockchainNetworksApi,
    staleTime: 5 * 60 * 1000
  })
  const {
    data: blockchainNetworks,
    isError: isBlockchainNetworksError,
    isLoading: isBlockchainNetworksLoading,
    refetch: refetchBlockchainNetworks
  } = blockchainNetworksQuery

  const availableBlockchainNetworksQuery = useQuery({
    queryKey: ['admin', 'blockchainNetworks', 'getAvailable'],
    queryFn: getAvailableBlockchainNetworksApi
  })
  const { data: availableBlockchainNetworks } = availableBlockchainNetworksQuery

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

  if (!adminRouteData) {
    return null
  }

  const { user } = adminRouteData

  if (!user) {
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
          disabled={
            isBlockchainNetworksLoading || !isAvailableForAdmin(user.role)
          }
        >
          Добавить
        </Button>
      </div>
    ),
    [handleAddBlockchainNetworkClick, isBlockchainNetworksLoading]
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
        {availableBlockchainNetworks && (
          <BlockchainNetworkForm
            mode='create'
            availableBlockchainNetworks={availableBlockchainNetworks}
            onClose={closeCreateBlockchainNetworkModalHandler}
          />
        )}
      </Modal>

      <Modal
        open={!!updatingBlockchainNetworks}
        onClose={closeUpdateBlockchainNetworksModalHandler}
      >
        {updatingBlockchainNetworks && availableBlockchainNetworks && (
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
          renderHeader({ totalCount: blockchainNetworks?.length || 0 })
        }
        renderItem={renderItem}
        emptyPlaceholder={
          <Text variant='body-2' color='secondary'>
            Список блокчейн сетей пуст
          </Text>
        }
        isLoading={isBlockchainNetworksLoading}
        loaderText='Загрузка блокчейн сетей'
        isError={isBlockchainNetworksError}
        refetch={refetchBlockchainNetworks}
      />
    </>
  )
}
