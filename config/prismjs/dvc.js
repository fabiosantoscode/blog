// Command arrays are intentionally reverse sorted
// to prevent shorter matches before longer ones

const commands = [
  'which',
  'wget',
  'virtualenv',
  'vi',
  'unzip',
  'tree',
  'tar',
  'sudo',
  'source',
  'rm',
  'python',
  'pip',
  'mkdir',
  'md5',
  'ls',
  'file',
  'export',
  'exec',
  'echo',
  'du',
  'curl',
  'cp',
  'cd',
  'cat',
  'autoload'
];

const git = [
  'tag',
  'status',
  'push',
  'pull',
  'merge',
  'init',
  'fetch',
  'commit',
  'clone',
  'checkout',
  'add'
];

const dvc = [
  'version',
  'update',
  'unprotect',
  'unlock',
  'tag',
  'status',
  'run',
  'root',
  'repro',
  'remove',
  'remote remove',
  'remote modify',
  'remote list',
  'remote default',
  'remote add',
  'remote',
  'push',
  'pull',
  'pkg',
  'pipeline show',
  'pipeline list',
  'pipeline',
  'move',
  'metrics show',
  'metrics remove',
  'metrics modify',
  'metrics add',
  'metrics',
  'lock',
  'install',
  'init',
  'import-url',
  'import',
  'help',
  'get-url',
  'get',
  'gc',
  'fetch',
  'diff',
  'destroy',
  'config',
  'commit',
  'checkout',
  'cache dir',
  'cache',
  'add'
];

const keywords = [
  'while',
  'until',
  'time',
  'then',
  'select',
  'in',
  'if',
  'function',
  'for',
  'fi',
  'esac',
  'else',
  'elif',
  'done',
  'do',
  'case'
];

const beforeCommand = String.raw`(\$[\s(]+|;\s*)`;

const variable = {
  pattern: /\$[a-zA-Z_][a-zA-Z_0-9]*/,
  greedy: true
};

const comment = {
  pattern: /#.*/,
  greedy: true
};

const insideLine = {
  command: {
    pattern: new RegExp(
      String.raw`${beforeCommand}\b(?:${commands.concat(keywords).join('|')})\b`
    ),
    greedy: true,
    lookbehind: true
  },
  git: {
    pattern: new RegExp(
      String.raw`${beforeCommand}\b(?:git (?:${git.join('|')}))\b`
    ),
    greedy: true,
    lookbehind: true
  },
  dvc: {
    pattern: new RegExp(
      String.raw`${beforeCommand}\b(?:dvc (?:${dvc.join('|')}))\b`
    ),
    greedy: true,
    lookbehind: true
  },
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
    inside: {
      variable: { ...variable }
    }
  },
  variable
};

const subcommand = {
  pattern: /\$\((.+)\)/,
  inside: { ...insideLine },
  alias: 'important'
};

module.exports = {
  comment: { ...comment },
  line: {
    pattern: /(?<=(^|\n))\$[\s\S]*?[^\\](:?\n|$)/,
    inside: {
      subcommand,
      ...insideLine
    }
  }
};
