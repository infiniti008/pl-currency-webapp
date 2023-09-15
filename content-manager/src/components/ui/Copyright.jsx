function Copyright({isInline}) {
  return (
    isInline 
    ? <div className="copyright">
      <span>Produced by</span>
      <br />
      <em>Currency Notifications App</em>
    </div>
    : <div className="copyright">
      <span>Produced by <em>Currency Notifications App</em></span>
    </div>
  )
}

export default Copyright