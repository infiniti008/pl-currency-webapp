import { useContext, useState } from 'react';
import CurrentStoreContext from '../store';

function TabPhoto() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)
}

export default TabPhoto