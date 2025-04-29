import React from 'react'
import { BlockLoader } from '../BlockLoader'
import { BlockError } from '../BlockError'

import styles from './styles.module.css'

interface CurrencyEntityListProps<T, P = object> {
  renderHeader?: (props?: P) => React.ReactNode
  items?: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  getItemId: (item: T) => string | number
  listContainerClassName?: string
  itemContainerClassName?: string
  headerProps?: P
  emptyPlaceholder?: React.ReactNode
  isLoading: boolean
  loaderText: string
  isError: boolean
  refetch: () => void
}

function NonMemoCurrencyEntityList<T, P>({
  renderHeader,
  items,
  renderItem,
  getItemId,
  listContainerClassName,
  itemContainerClassName,
  headerProps,
  emptyPlaceholder,
  isLoading,
  loaderText,
  isError,
  refetch
}: CurrencyEntityListProps<T, P>) {
  return (
    <>
      <div className={styles.entities}>
        {renderHeader && (
          <div className={styles.entities_header}>
            {renderHeader(headerProps)}
          </div>
        )}

        {isLoading && <BlockLoader text={loaderText} />}

        {isError && (
          <BlockError text='Не удалось загрузить' refetch={refetch} />
        )}

        {items && (
          <div className={styles['entities-list']}>
            {items.length === 0 ? (
              <div className={styles['entities-list__emplty']}>
                {emptyPlaceholder}
              </div>
            ) : (
              items.map((item, index) => (
                <div key={getItemId(item)} className={styles.entity}>
                  {renderItem(item, index)}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}

export const CurrencyEntityList = React.memo(
  NonMemoCurrencyEntityList
) as typeof NonMemoCurrencyEntityList
;(CurrencyEntityList as React.FC).displayName = 'CurrencyEntityList'
