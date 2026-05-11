#!/usr/bin/env node
const {execSync}=require('child_process');
function r(c){try{return execSync(c,{timeout:10000}).toString().trim()}catch{return ''}}
const report={
  time:new Date().toISOString(),host:r('hostname'),uptime:r('uptime -p'),
  errors:r('journalctl -p err --since "1 hour ago" --no-pager 2>/dev/null|wc -l'),
  ssh:r("journalctl -u sshd --since '1 hour ago' 2>/dev/null|grep -c 'Failed password'||echo 0"),
  oom:r("dmesg 2>/dev/null|grep -c 'oom-kill'||echo 0"),
  disk:r("df -h /|awk 'NR==2{print $5}'"),
  mem:r("free -m|awk '/Mem:/{printf \"%d%%\",$3/$2*100}'"),
  load:r("cat /proc/loadavg|awk '{print $1\",\"$2\",\"$3}'"),
  top:r("journalctl -p err --since '1 hour ago' --no-pager 2>/dev/null|tail -3")};
const j=process.argv.includes('--json');
if(j)console.log(JSON.stringify(report,null,2));
else{console.log(`\n  📋 logwatch - 日志快照`);
  console.log(`  ─────────────────`);
  console.log(`  主机: ${report.host}`);
  console.log(`  运行: ${report.uptime}`);
  console.log(`  错误: ${report.errors}/h | SSH: ${report.ssh}/h | OOM: ${report.oom}`);
  console.log(`  磁盘: ${report.disk} | 内存: ${report.mem} | 负重: ${report.load}`);
  if(report.top)console.log(`  最近:\n${report.top.split('\n').slice(0,3).map(l=>'    '+l).join('\n')}`);
  console.log(`  🔗 github.com/laolaoqi/logwatch\n`);}
