/**
 * The standard risk disclosure block. It appeared verbatim in six places in
 * the original page; keeping one copy means the wording can never drift
 * between them.
 */
export default function RiskNote({ className = '', style }) {
  return (
    <div className={'red-note' + (className ? ' ' + className : '')} style={style}>
      <span className="red-note-title">⚠ Risk Disclosure</span>
      Futures and forex trading contains substantial risk and is not for every investor. An investor
      could potentially lose all or more than the initial investment. Risk capital is money that can
      be lost without jeopardizing ones&rsquo; financial security or lifestyle. Only risk capital
      should be used for trading and only those with sufficient risk capital should consider
      trading. Past performance is not necessarily indicative of future results.
    </div>
  )
}
