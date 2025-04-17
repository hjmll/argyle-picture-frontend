// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addCategory POST /api/category/add */
export async function addCategoryUsingPost(
  body: API.CategoryAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteCategory POST /api/category/delete */
export async function deleteCategoryUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/category/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getCategoryById GET /api/category/get */
export async function getCategoryByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoryByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCategory_>('/api/category/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** getCategoryVOById GET /api/category/get/vo */
export async function getCategoryVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoryVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCategoryVO_>('/api/category/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listCategoryByPage POST /api/category/list/page */
export async function listCategoryByPageUsingPost(
  body: API.CategoryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListCategory_>('/api/category/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listCategoryVOByPage POST /api/category/list/page/vo */
export async function listCategoryVoByPageUsingPost(
  body: API.CategoryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCategoryVO_>('/api/category/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateCategory POST /api/category/update */
export async function updateCategoryUsingPost(
  body: API.CategoryUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
