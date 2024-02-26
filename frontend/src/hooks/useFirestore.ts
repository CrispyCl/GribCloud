import { useEffect, useState } from 'react'

export function useFirestore(file: File) {
  const [docs, setDocs] = useState<any[]>([])

  useEffect(() => {}, [file])
}
