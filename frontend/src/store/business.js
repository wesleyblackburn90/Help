import { csrfFetch } from "./csrf"

const GET_ALL_BUSINESSES = '/business/getAllBusinesses'
const CREATE_BUSINESS = '/business/createBusiness'
const UPDATE_BUSINESS = '/business/updateBusiness'
const DELETE_BUSINESS = '/business/deleteBusiness'
const CREATE_REVIEW = '/business/createReview'
const DELETE_REVIEW = '/business/deleteReview'

//action creator
const getBusinesses = (businesses) => {
  return {
    type: GET_ALL_BUSINESSES,
    businesses
  }
}

const createBusiness = (businesses) => {
  return {
    type: CREATE_BUSINESS,
    businesses
  }
}

const updateBusiness = (businesses) => {
  return {
    type: UPDATE_BUSINESS,
    businesses
  }
}

const deleteBusiness = (business) => {
  return {
    type: DELETE_BUSINESS,
    business
  }
}

const createReviews = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  }
}

const deleteReviews = (review) => {
  return {
    type: DELETE_REVIEW,
    review
  }
}

//thunk action creator
export const getAllBusinesses = () => async (dispatch) => {
  const response = await csrfFetch("/api/business")

  if (response.ok) {
    const data = await response.json()
    dispatch(getBusinesses(data))
    return data
  }
}

export const createBusinesses = (data) => async (dispatch) => {
  const response = await csrfFetch("/api/business", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const business = await response.json()
  dispatch(createBusiness(business))
  return business
}

export const editBusiness = data => async (dispatch) => {
  const response = await csrfFetch(`/api/business/${data.id}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  // console.log(data, "<=== data")
  // console.log(response, "<=== response")

  if (response.ok) {
    const business = await response.json()
    dispatch(updateBusiness(business))
    return business
  }
}

export const deleteBusinesses = (businessId) => async (dispatch) => {
  console.log(businessId, "<== business Id")
  const response = await csrfFetch(`/api/business/${businessId}`, {
    method: 'delete',
  })
  console.log(response, "<== response")

  if (response.ok) {
    const { deletedBusiness } = await response.json()
    dispatch(deleteBusiness(deletedBusiness))
    return deletedBusiness
  }
}

export const createReview = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/business/${data.businessId}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const review = await response.json()
  dispatch(createReviews(review))
  return review
}

//state object
const initialState = {}

//reducer
const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BUSINESSES: {
      const allBusinesses = {};
      action.businesses.forEach((business) => (allBusinesses[business.id] = business));
      return allBusinesses
    }
    case CREATE_BUSINESS: {
      const newState = {
        ...state,
        [action.businesses.id]: action.businesses
      };
      return { ...newState }
    }
    case UPDATE_BUSINESS:
      return {
        ...state,
        [action.businesses.id]: action.businesses
      }
    case DELETE_BUSINESS: {
      const newState = { ...state }
      delete newState[action.businessId]
      return newState
    }
    case CREATE_REVIEW: {
      const businessId = action.review.businessId
      console.log(businessId, "<== business id")
      console.log(state, "<== state")
      console.log("*********************************************************")
      console.log(state[businessId].Reviews)
      const newState = JSON.parse(JSON.stringify(state))

      newState[businessId].Reviews.push(action.review)
      console.log(newState, "<===newstate")
      return newState
    }
    default:
      return state;
  }
}

export default businessReducer;
