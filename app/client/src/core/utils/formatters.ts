/**
 * Форматирует время для отображения в списке чатов и сообщениях
 */
export const formatMessageTime = (timestamp: Date | string) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  
  // Если сообщение сегодня - показываем только время
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Если вчера, показываем "Вчера"
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }
  
  // Иначе показываем дату
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

/**
 * Форматирует дату для отображения разделителей в чате
 */
export const formatMessageDate = (timestamp: Date | string) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  
  // Если сообщение сегодня
  if (date.toDateString() === now.toDateString()) {
    return 'Сегодня';
  }
  
  // Если вчера
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }
  
  // Иначе показываем полную дату
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};
