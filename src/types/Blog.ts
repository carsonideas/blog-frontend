export interface Blog {
  id: string
  title: string
  content: string
  imageUrl?: string // New field for blog image
  authorId: string
  author?: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    profileImage?: string
  }
  createdAt: string
  updatedAt: string
}

