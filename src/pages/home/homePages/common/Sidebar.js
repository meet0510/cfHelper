import { useState } from 'react';
import Timer from '../../../../components/Timer'
import Rank from './Rank';
import './Sidebar.css'

export default function Sidebar({ users, time }) {
  const [timerValue, setTimerValue] = useState(1);

  return (
    <div className='side-bar'>
      <Timer minutes={parseInt(time)} seconds={0} passTimerValue={setTimerValue} />
      {users.map(user => <Rank user={user} />)}
    </div>
  )
}
