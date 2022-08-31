import SolvedCount from './SolvedCount'
import Timer from '../../../components/Timer'
import './Sidebar.css'

export default function Sidebar({ contestId }) {
  return (
    <div className='side-bar'>
      <Timer minutes={160} seconds={0}/>
      <SolvedCount contestId = {contestId}/>
    </div>
  )
}