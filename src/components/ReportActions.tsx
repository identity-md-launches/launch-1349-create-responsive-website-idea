import { useState } from 'react';

interface Props {
  siteName: string;
  onSiteName: (next: string) => void;
  onDownload: () => void;
  onCopy: () => Promise<boolean>;
  onReset: () => void;
  hasProgress: boolean;
}

type Status = '' | 'copied' | 'copy-failed' | 'downloaded' | 'reset';

const messages: Record<Status, string> = {
  '': '',
  copied: 'Report copied to the clipboard.',
  'copy-failed': 'Unable to copy. Download the report instead.',
  downloaded: 'Report download started.',
  reset: 'Progress cleared.',
};

export const ReportActions = ({ siteName, onSiteName, onDownload, onCopy, onReset, hasProgress }: Props) => {
  const [status, setStatus] = useState<Status>('');
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="card" style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <p className="card-title">Report</p>
      <div className="field">
        <label htmlFor="site-name">Site name</label>
        <input
          id="site-name"
          name="site-name"
          type="text"
          autoComplete="organization"
          placeholder="example.com"
          value={siteName}
          maxLength={120}
          onChange={(e) => onSiteName(e.target.value)}
          aria-describedby="site-name-hint"
        />
        <span id="site-name-hint" className="field-hint">
          Used as the report title. Optional.
        </span>
      </div>

      <div className="actions">
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            onDownload();
            setStatus('downloaded');
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" />
          </svg>
          Download report
        </button>
        <button
          type="button"
          className="button"
          onClick={async () => {
            const ok = await onCopy();
            setStatus(ok ? 'copied' : 'copy-failed');
          }}
        >
          Copy report
        </button>
        {confirming ? (
          <>
            <button
              type="button"
              className="button"
              onClick={() => {
                onReset();
                setConfirming(false);
                setStatus('reset');
              }}
            >
              Clear all progress
            </button>
            <button type="button" className="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="button"
            disabled={!hasProgress}
            onClick={() => {
              setStatus('');
              setConfirming(true);
            }}
          >
            Reset progress
          </button>
        )}
      </div>
      <p className="status" role="status" aria-live="polite">
        {confirming ? 'Clear every ticked item? This cannot be undone.' : messages[status]}
      </p>
    </div>
  );
};
