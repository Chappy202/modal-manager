module.exports = {
  types: [
    { type: 'feat', section: '✨ Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'docs', section: '📝 Documentation' },
    { type: 'style', section: '💄 Styling' },
    { type: 'refactor', section: '♻️ Refactors' },
    { type: 'perf', section: '⚡️ Performance' },
    { type: 'test', section: '✅ Tests' },
    { type: 'build', section: '🛠️ Build' },
    { type: 'ci', section: '👷 CI' },
    { type: 'chore', section: '🔧 Chores' },
    { type: 'revert', section: '⏪ Reverts' }
  ],
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
  userUrlFormat: '{{host}}/{{user}}',
  releaseCommitMessageFormat: 'chore(release): 🚀 release {{currentTag}}'
};
