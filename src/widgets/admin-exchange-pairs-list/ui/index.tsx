import { useCallback, useState } from 'react'
import { AxiosError } from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Icon, Modal, Popover, Text, Tooltip } from '@gravity-ui/uikit'
import { Archive } from '@gravity-ui/icons'
import { Route as AdminRoute } from '@/routes/admin/route'
import { queryClient } from '@/app/main'
import {
  ExchangePair,
  getExchangePairsApi,
  UpdateExchangeErrorResponse,
  updateExchangePairApi,
  UpdateExchangePairBody,
  UpdateExchangePairParams,
  UpdateExchangeSuccessResponse
} from '@/shared/api/v1/exchangePairsApi'
import { BlockLoader } from '@/shared/ui/BlockLoader'
import { BlockError } from '@/shared/ui/BlockError'
import { isAvailableForAdmin } from '@/shared/utils/checkUserRules'
import { ExchangePairStatus } from './ExchangePairStatus'
import { ExchangePairStatusPopover } from './ExchangePairStatusPopover'
import { ArchiveExchangePairForm } from './ArchiveExchangePairForm'
import { ExchangePairContainer } from './ExchangePairContainer'
import { ExchangePairMarkupPersentagePopover } from './ExchangePairMarkupPersentagePopover'
import { ExchangePairInfoPopover } from './ExchangePairInfoPopover'
import { CreateExchangePairForm } from './CreateExchangePairForm'

import styles from './styles.module.css'

export function AdminExchangePairsWidget() {
  const adminRouteData = AdminRoute.useLoaderData()

  const [isCreatingExchangePairModalOpen, setIsCreatingExchangePairModalOpen] =
    useState(false)
  const openCreateExchangePairModalHandler = () =>
    setIsCreatingExchangePairModalOpen(true)
  const closeCreateExchangePairModalHandler = () =>
    setIsCreatingExchangePairModalOpen(false)

  const [archivingExchangePair, setArchivingExchangePair] =
    useState<ExchangePair | null>(null)
  const closeArchivingExchangePairModalHandler = () =>
    setArchivingExchangePair(null)
  const archiveExchangePairFormHandler = useCallback(
    (exchangePair: ExchangePair) => {
      setArchivingExchangePair(exchangePair)
    },
    [setArchivingExchangePair]
  )

  if (!adminRouteData) {
    return null
  }

  const { user } = adminRouteData

  if (!user) {
    return null
  }

  const exchangePairsQuery = useQuery({
    queryKey: ['admin', 'exchangePairs', 'getAll'],
    queryFn: getExchangePairsApi,
    staleTime: 5 * 60 * 1000
  })

  const {
    data: exchangePairs,
    isLoading,
    isError,
    refetch
  } = exchangePairsQuery

  const { mutate: updateExchangePair, isPending: isUpdatingExchangePair } =
    useMutation<
      UpdateExchangeSuccessResponse,
      AxiosError<UpdateExchangeErrorResponse>,
      { params: UpdateExchangePairParams; body: UpdateExchangePairBody }
    >({
      mutationFn: updateExchangePairApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['admin', 'exchangePairs', 'getAll']
        })
      },
      onError: () => {
        console.error('Не удалось поменять ExchangePair')
      }
    })

  const updateExchangePairHandler = useCallback(
    ({
      exchangePairId,
      status,
      markupPercentage
    }: {
      exchangePairId: string
      status?: ExchangePair['status']
      markupPercentage?: string
    }) => {
      updateExchangePair({
        params: { id: exchangePairId },
        body: { status, markupPercentage }
      })
    },
    []
  )

  return (
    <div className={styles['admin-exchange-pair_container']}>
      <div className={styles['admin-exchange-pair_header']}>
        <Text variant='subheader-3'>
          Список обменных пар{' '}
          <Text variant='subheader-3' color='secondary'>
            ({exchangePairs?.length || 0})
          </Text>
        </Text>

        <Button
          size='m'
          view='flat-action'
          onClick={openCreateExchangePairModalHandler}
          disabled={isLoading || !isAvailableForAdmin(user.role)}
        >
          Добавить
        </Button>
      </div>

      {isLoading && <BlockLoader text='Загрузка обменных пар' />}

      {isError && <BlockError text='Не удалось загрузить' refetch={refetch} />}

      {exchangePairs && (
        <div className={styles['admin-exchange-pair_content']}>
          {exchangePairs.length === 0 && (
            <div>
              <Text variant='body-2' color='secondary'>
                Список обменных пар пуст
              </Text>
            </div>
          )}

          {exchangePairs.map((exchangePair) => {
            return (
              <div
                key={exchangePair.id}
                className={styles['admin-exchange-pair_item']}
              >
                <Popover
                  trigger='click'
                  hasArrow
                  content={
                    <ExchangePairInfoPopover exchangePair={exchangePair} />
                  }
                >
                  <div className={styles['admin-exchange-pair_wrapper']}>
                    <ExchangePairContainer exchangePair={exchangePair} />
                  </div>
                </Popover>

                <Popover
                  trigger='click'
                  hasArrow
                  content={
                    <ExchangePairStatusPopover
                      exchangePairId={exchangePair.id}
                      status={exchangePair.status}
                      isUpdating={isUpdatingExchangePair}
                      onUpdate={updateExchangePairHandler}
                    />
                  }
                >
                  <div>
                    <ExchangePairStatus status={exchangePair.status} />
                  </div>
                </Popover>

                <Popover
                  trigger='click'
                  hasArrow
                  content={
                    <ExchangePairMarkupPersentagePopover
                      exchangePairId={exchangePair.id}
                      markupPercentage={exchangePair.markupPercentage}
                      isUpdating={isUpdatingExchangePair}
                      onUpdate={updateExchangePairHandler}
                    />
                  }
                >
                  <Text variant='body-2' className={styles['changeble-prop']}>
                    {exchangePair.markupPercentage} %{' '}
                    <Text variant='body-2' color='secondary'>
                      комиссия
                    </Text>
                  </Text>
                </Popover>

                <div className={styles['admin-exchange-pair_item_action']}>
                  {exchangePair.status !== 'ARCHIVED' && (
                    <Tooltip content='Архивировать' openDelay={200}>
                      <Button
                        size='m'
                        view='flat-danger'
                        disabled={!isAvailableForAdmin(user.role)}
                        onClick={() =>
                          archiveExchangePairFormHandler(exchangePair)
                        }
                      >
                        <Icon data={Archive} size={16} />
                      </Button>
                    </Tooltip>
                  )}
                  {exchangePair.status === 'ARCHIVED' && (
                    <Tooltip content='Разархивировать' openDelay={200}>
                      <Button
                        size='m'
                        view='flat-success'
                        disabled={!isAvailableForAdmin(user.role)}
                        onClick={() =>
                          updateExchangePairHandler({
                            exchangePairId: exchangePair.id,
                            status: 'INACTIVE'
                          })
                        }
                      >
                        <Icon data={Archive} size={16} />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={isCreatingExchangePairModalOpen}
        onClose={closeCreateExchangePairModalHandler}
      >
        <CreateExchangePairForm onClose={closeCreateExchangePairModalHandler} />
      </Modal>

      <Modal
        open={!!archivingExchangePair}
        onClose={closeArchivingExchangePairModalHandler}
      >
        {archivingExchangePair && (
          <ArchiveExchangePairForm
            exchangePair={archivingExchangePair}
            onClose={closeArchivingExchangePairModalHandler}
          />
        )}
      </Modal>
    </div>
  )
}
