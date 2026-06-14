import { Avatar, Spinner } from '@/components'
import { EmptyState } from '@/components/EmptyState'
import { ChatListItem } from './ChatListItem'
import noResultsAnim from '@/assets/lottie/no-results.json'
import type { SearchedUser } from '@/types/search'
import type { Chat } from '@/types/chat'
import styles from './SearchResults.module.scss'

interface SearchResultsProps {
  matchedChats: Chat[]
  activeChatId: number | null
  onSelectChat: (chatId: number) => void
  result: SearchedUser | null
  status: 'idle' | 'loading' | 'notFound' | 'done'
  onSelectUser: (user: SearchedUser) => void
  isCreating: boolean
}

export function SearchResults({
  matchedChats,
  activeChatId,
  onSelectChat,
  result,
  status,
  onSelectUser,
  isCreating,
}: SearchResultsProps) {
  const hasChats = matchedChats.length > 0
  const hasUser = status === 'done' && result !== null
  const loading = status === 'loading'
  const nothing = !hasChats && !hasUser && !loading

  return (
    <div>
      {hasChats && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Чаты</p>
          {matchedChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className={styles.centered}>
          <Spinner />
        </div>
      )}

      {hasUser && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Пользователь</p>
          <button
            className={styles.item}
            onClick={() => onSelectUser(result)}
            disabled={isCreating}
          >
            <Avatar
              name={result.fullname ?? result.username}
              src={result.avatar_url}
            />
            <div className={styles.body}>
              <span className={styles.name}>
                {result.fullname ?? result.username ?? 'Пользователь'}
              </span>
              {result.username && (
                <span className={styles.username}>@{result.username}</span>
              )}
            </div>
            {isCreating && <Spinner size="sm" />}
          </button>
        </div>
      )}

      {nothing && (
        <EmptyState
          animation={noResultsAnim}
          title="Ничего не найдено"
          subtitle="Попробуйте другой запрос"
          size={160}
        />
      )}
    </div>
  )
}
