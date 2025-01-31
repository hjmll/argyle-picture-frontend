declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCategory_ = {
    code?: number
    data?: Category
    message?: string
  }

  type BaseResponseCategoryVO_ = {
    code?: number
    data?: CategoryVO
    message?: string
  }

  type BaseResponseInt_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseListCategory_ = {
    code?: number
    data?: Category[]
    message?: string
  }

  type BaseResponseListTag_ = {
    code?: number
    data?: Tag[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageCategoryVO_ = {
    code?: number
    data?: PageCategoryVO_
    message?: string
  }

  type BaseResponsePagePicture_ = {
    code?: number
    data?: PagePicture_
    message?: string
  }

  type BaseResponsePagePictureVO_ = {
    code?: number
    data?: PagePictureVO_
    message?: string
  }

  type BaseResponsePageTagVO_ = {
    code?: number
    data?: PageTagVO_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponsePicture_ = {
    code?: number
    data?: Picture
    message?: string
  }

  type BaseResponsePictureTagCategory_ = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type BaseResponsePictureVO_ = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseTag_ = {
    code?: number
    data?: Tag
    message?: string
  }

  type BaseResponseTagVO_ = {
    code?: number
    data?: TagVO
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type Category = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    name?: string
    updateTime?: string
    usageCount?: number
  }

  type CategoryAddRequest = {
    name?: string
  }

  type CategoryQueryRequest = {
    current?: number
    id?: number
    name?: string
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type CategoryUpdateRequest = {
    id?: number
    name?: string
  }

  type CategoryVO = {
    createTime?: string
    editTime?: string
    id?: number
    name?: string
    updateTime?: string
    usageCount?: number
  }

  type DeleteRequest = {
    id?: number
  }

  type getCategoryByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getCategoryVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getTagByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getTagVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type LoginUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type PageCategoryVO_ = {
    current?: number
    pages?: number
    records?: CategoryVO[]
    size?: number
    total?: number
  }

  type PagePicture_ = {
    current?: number
    pages?: number
    records?: Picture[]
    size?: number
    total?: number
  }

  type PagePictureVO_ = {
    current?: number
    pages?: number
    records?: PictureVO[]
    size?: number
    total?: number
  }

  type PageTagVO_ = {
    current?: number
    pages?: number
    records?: TagVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type Picture = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    isDelete?: number
    name?: string
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    spaceId?: number
    tags?: string
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    userId?: number
  }

  type PictureEditRequest = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type PictureQueryRequest = {
    category?: string
    current?: number
    id?: number
    introduction?: string
    name?: string
    pageSize?: number
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    tags?: string[]
    userId?: number
  }

  type PictureReviewRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureTagCategory = {
    categoryList?: string[]
    tagList?: string[]
  }

  type PictureUpdateRequest = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type PictureUploadByBatchRequest = {
    count?: number
    namePrefix?: string
    searchText?: string
  }

  type PictureUploadRequest = {
    fileUrl?: string
    id?: number
    picName?: string
  }

  type PictureVO = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    name?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewStatus?: number
    tags?: string[]
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
  }

  type Tag = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    name?: string
    updateTime?: string
    usageCount?: number
  }

  type TagAddRequest = {
    name?: string
  }

  type TagQueryRequest = {
    current?: number
    id?: number
    name?: string
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type TagUpdateRequest = {
    id?: number
    name?: string
  }

  type TagVO = {
    createTime?: string
    editTime?: string
    id?: number
    name?: string
    updateTime?: string
    usageCount?: number
  }

  type testDownloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type uploadPictureUsingPOSTParams = {
    fileUrl?: string
    id?: number
    picName?: string
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
