import { useState } from "react"
import { createSearchParams, useNavigate, useSearchParams } from "react-router"



const useCustomMove = (): UseCustomMoveReturn => {

  const navigate = useNavigate()

  const [queryParams] = useSearchParams()

  const [refresh, setRefresh] = useState<boolean>(false) //추가 

  const pageStr: string | null  = queryParams.get('page') 
  const sizeStr: string | null  = queryParams.get('size')

  const page: number = pageStr ? Number(pageStr) : 1
  const size: number = sizeStr ? Number(sizeStr) : 10

  const queryDefault = createSearchParams({
    page: String(page),
    size: String(size),
  }).toString()

  const moveToList = (pageParam?: PageParam ) => {

    let queryStr = ''

    if (pageParam) {
      const pageNum = Number(pageParam.page || 1)
      const sizeNum = Number(pageParam.size || 10)

      queryStr = createSearchParams({
        page: String(pageNum),
        size: String(sizeNum),
      }).toString()

      if(queryStr === queryDefault){
        setRefresh(!refresh)
      }


    } else {
      queryStr = queryDefault
    }

    navigate({ pathname: `../list`, search: queryStr })
  }

  const moveToModify = (tno:number) => {

    console.log(queryDefault)

    navigate({
      pathname: `../modify/${tno}`,
      search: queryDefault  //수정시에 기존의 쿼리 스트링 유지를 위해 
    })
  }

  const moveToRead = (tno:number) => {

    console.log(queryDefault)

    navigate({
      pathname: `../read/${tno}`,
      search: queryDefault
    })
  }



  return { moveToList, moveToModify, moveToRead, page, size, refresh }
}


export default useCustomMove