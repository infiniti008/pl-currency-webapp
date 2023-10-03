import IconSuccess from '../../icons/IconSuccess';
import IconError from '../../icons/IconError';

function Status({status}) {
  return (status ? <IconSuccess /> : <IconError />)
}

export default Status;