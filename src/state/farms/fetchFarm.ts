import { Farm } from 'state/types'
import fetchPublicFarmData from './fetchPublicFarmData'

const fetchFarm = async (farm: Farm): Promise<Farm> => {
  const farmPublicData = await fetchPublicFarmData(farm)
  return { ...farm, ...farmPublicData }

  // try {
  //   const farmPublicData = await fetchPublicFarmData(farm)
  //   return { ...farm, ...farmPublicData }
  // } catch (e) {
  //   console.log(e)
  // }
  
  // return {...farm}
}

export default fetchFarm
