# Pipeline security documentation
## Trivy
I integrated Trivy by adding the following stage to my Jenkinsfile between the Build and Run stages. Trivy scans for known vulnerabilities in the packages used by the application.
``` groovy
stage('Security Scan') {
    steps {
        sh '''
            docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -v "$HOME/.cache/trivy:/root/.cache/" \
                aquasec/trivy:${TRIVY_VERSION} \
                image \
                --exit-code 1 \
                --severity HIGH,CRITICAL \
                ${IMAGE_NAME}
        '''
    }
}
```
After that, it found 4 vulnerabilities in the docker container itself and 41 in node.js.
```
blog:latest (alpine 3.23.4)
===========================
Total: 4 (HIGH: 4, CRITICAL: 0)

┌────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬──────────────────────────────────────────────────────────┐
│  Library   │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │                          Title                           │
├────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼──────────────────────────────────────────────────────────┤
│ libcrypto3 │ CVE-2026-14456 │ HIGH     │ fixed  │ 3.5.6-r0          │ 3.5.8-r0      │ openssl: OpenSSL: Denial of Service via unbounded memory │
│            │                │          │        │                   │               │ growth in QUIC server...                                 │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-14456               │
│            ├────────────────┤          │        │                   ├───────────────┼──────────────────────────────────────────────────────────┤
│            │ CVE-2026-45447 │          │        │                   │ 3.5.7-r0      │ openssl: Heap Use-After-Free in OpenSSL PKCS7_verify()   │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-45447               │
├────────────┼────────────────┤          │        │                   ├───────────────┼──────────────────────────────────────────────────────────┤
│ libssl3    │ CVE-2026-14456 │          │        │                   │ 3.5.8-r0      │ openssl: OpenSSL: Denial of Service via unbounded memory │
│            │                │          │        │                   │               │ growth in QUIC server...                                 │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-14456               │
│            ├────────────────┤          │        │                   ├───────────────┼──────────────────────────────────────────────────────────┤
│            │ CVE-2026-45447 │          │        │                   │ 3.5.7-r0      │ openssl: Heap Use-After-Free in OpenSSL PKCS7_verify()   │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-45447               │
└────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴──────────────────────────────────────────────────────────┘

Node.js (node-pkg)
==================
Total: 41 (HIGH: 39, CRITICAL: 2)

┌────────────────────────────────┬────────────────┬──────────┬────────┬───────────────────┬─────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────┐
│            Library             │ Vulnerability  │ Severity │ Status │ Installed Version │                      Fixed Version                      │                            Title                             │
├────────────────────────────────┼────────────────┼──────────┼────────┼───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ brace-expansion (package.json) │ CVE-2026-13149 │ HIGH     │ fixed  │ 1.1.11            │ 5.0.7, 1.1.16, 2.1.2                                    │ brace-expansion: Brace-expansion: Denial of Service due to   │
│                                │                │          │        │                   │                                                         │ exponential-time complexity                                  │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-13149                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-14257 │          │        │                   │ 5.0.8, 3.0.3, 2.1.3, 1.1.17                             │ brace-expansion: Brace-expansion: Denial of Service via      │
│                                │                │          │        │                   │                                                         │ memory exhaustion in expand() function                       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-14257                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-69152 │          │        │                   │ 1.1.18, 2.1.4, 3.0.6, 5.0.9                             │ brace-expansion: DoS via unbounded intermediate arrays,      │
│                                │                │          │        │                   │                                                         │ bypassing the CVE-2026-14257 mitigation                      │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-69152                   │
│                                ├────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-13149 │          │        │ 2.0.1             │ 5.0.7, 1.1.16, 2.1.2                                    │ brace-expansion: Brace-expansion: Denial of Service due to   │
│                                │                │          │        │                   │                                                         │ exponential-time complexity                                  │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-13149                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-14257 │          │        │                   │ 5.0.8, 3.0.3, 2.1.3, 1.1.17                             │ brace-expansion: Brace-expansion: Denial of Service via      │
│                                │                │          │        │                   │                                                         │ memory exhaustion in expand() function                       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-14257                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-69152 │          │        │                   │ 1.1.18, 2.1.4, 3.0.6, 5.0.9                             │ brace-expansion: DoS via unbounded intermediate arrays,      │
│                                │                │          │        │                   │                                                         │ bypassing the CVE-2026-14257 mitigation                      │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-69152                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ cross-spawn (package.json)     │ CVE-2024-21538 │          │        │ 7.0.3             │ 7.0.5, 6.0.6                                            │ cross-spawn: regular expression denial of service            │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2024-21538                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ glob (package.json)            │ CVE-2025-64756 │          │        │ 10.4.2            │ 11.1.0, 10.5.0                                          │ glob: glob: Command Injection Vulnerability via Malicious    │
│                                │                │          │        │                   │                                                         │ Filenames                                                    │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2025-64756                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ ip-address (package.json)      │ CVE-2026-69192 │          │        │ 9.0.5             │ 10.3.1                                                  │ ip-address: ip-address: Inconsistent IP address parsing      │
│                                │                │          │        │                   │                                                         │ leads to Server-Side Request Forgery (SSRF)...               │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-69192                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ minimatch (package.json)       │ CVE-2026-26996 │          │        │ 3.1.2             │ 10.2.1, 9.0.6, 8.0.5, 7.4.7, 6.2.1, 5.1.7, 4.2.4, 3.1.3 │ minimatch: minimatch: Denial of Service via specially        │
│                                │                │          │        │                   │                                                         │ crafted glob patterns                                        │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-26996                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-27903 │          │        │                   │ 10.2.3, 9.0.7, 8.0.6, 7.4.8, 6.2.2, 5.1.8, 4.2.5, 3.1.3 │ minimatch: minimatch: Denial of Service due to unbounded     │
│                                │                │          │        │                   │                                                         │ recursive backtracking via crafted...                        │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-27903                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-27904 │          │        │                   │ 10.2.3, 9.0.7, 8.0.6, 7.4.8, 6.2.2, 5.1.8, 4.2.5, 3.1.4 │ minimatch: Minimatch: Denial of Service via catastrophic     │
│                                │                │          │        │                   │                                                         │ backtracking in glob expressions                             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-27904                   │
│                                ├────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-26996 │          │        │ 9.0.5             │ 10.2.1, 9.0.6, 8.0.5, 7.4.7, 6.2.1, 5.1.7, 4.2.4, 3.1.3 │ minimatch: minimatch: Denial of Service via specially        │
│                                │                │          │        │                   │                                                         │ crafted glob patterns                                        │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-26996                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-27903 │          │        │                   │ 10.2.3, 9.0.7, 8.0.6, 7.4.8, 6.2.2, 5.1.8, 4.2.5, 3.1.3 │ minimatch: minimatch: Denial of Service due to unbounded     │
│                                │                │          │        │                   │                                                         │ recursive backtracking via crafted...                        │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-27903                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-27904 │          │        │                   │ 10.2.3, 9.0.7, 8.0.6, 7.4.8, 6.2.2, 5.1.8, 4.2.5, 3.1.4 │ minimatch: Minimatch: Denial of Service via catastrophic     │
│                                │                │          │        │                   │                                                         │ backtracking in glob expressions                             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-27904                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ pacote (package.json)          │ CVE-2026-9496  │          │        │ 18.0.6            │ 21.5.1                                                  │ Versions of the package pacote from 11.2.7 and before 21.5.1 │
│                                │                │          │        │                   │                                                         │ are vulne...                                                 │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-9496                    │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ path-to-regexp (package.json)  │ CVE-2024-52798 │          │        │ 0.1.10            │ 0.1.12                                                  │ path-to-regexp: path-to-regexp Unpatched `path-to-regexp`    │
│                                │                │          │        │                   │                                                         │ ReDoS in 0.1.x                                               │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2024-52798                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-4867  │          │        │                   │ 0.1.13                                                  │ path-to-regexp: path-to-regexp: Denial of Service via        │
│                                │                │          │        │                   │                                                         │ catastrophic backtracking from malformed URL parameters...   │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-4867                    │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ sigstore (package.json)        │ CVE-2026-48815 │          │        │ 2.3.1             │ 4.1.1                                                   │ sigstore: Sigstore: Unauthorized certificates accepted due   │
│                                │                │          │        │                   │                                                         │ to ignored `certificateOIDs` verification option             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-48815                   │
├────────────────────────────────┼────────────────┼──────────┤        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ tar (package.json)             │ CVE-2026-59873 │ CRITICAL │        │ 6.2.1             │ 7.5.19                                                  │ tar: node-tar: Denial of Service via crafted gzip bomb       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-59873                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┼──────────┤        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-23745 │ HIGH     │        │                   │ 7.5.3                                                   │ node-tar: tar: node-tar: Arbitrary file overwrite and        │
│                                │                │          │        │                   │                                                         │ symlink poisoning via unsanitized linkpaths...               │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-23745                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-23950 │          │        │                   │ 7.5.4                                                   │ node-tar: tar: node-tar: Arbitrary file overwrite via        │
│                                │                │          │        │                   │                                                         │ Unicode path collision race condition...                     │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-23950                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-24842 │          │        │                   │ 7.5.7                                                   │ node-tar: tar: node-tar: Arbitrary file creation via path    │
│                                │                │          │        │                   │                                                         │ traversal bypass in hardlink...                              │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-24842                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-26960 │          │        │                   │ 7.5.8                                                   │ node-tar: node-tar: Arbitrary file read/write via malicious  │
│                                │                │          │        │                   │                                                         │ archive hardlink creation                                    │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-26960                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-29786 │          │        │                   │ 7.5.10                                                  │ node-tar: hardlink path traversal via drive-relative         │
│                                │                │          │        │                   │                                                         │ linkpath                                                     │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-29786                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-31802 │          │        │                   │ 7.5.11                                                  │ tar: tar: File overwrite via drive-relative symlink          │
│                                │                │          │        │                   │                                                         │ traversal                                                    │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-31802                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-59874 │          │        │                   │ 7.5.18                                                  │ tar: Node-tar: Denial of Service via malformed tar archive   │
│                                │                │          │        │                   │                                                         │ header                                                       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-59874                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-73566 │          │        │                   │ 7.5.21                                                  │ tar: node-tar: Denial of Service via crafted long-path tar   │
│                                │                │          │        │                   │                                                         │ archive                                                      │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-73566                   │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
│                                │                │          │        │                   │                                                         │                                                              │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ tar-fs (package.json)          │ CVE-2024-12905 │          │        │ 2.1.1             │ 1.16.4, 2.1.2, 3.0.7                                    │ tar-fs: link following and path traversal via maliciously    │
│                                │                │          │        │                   │                                                         │ crafted tar file                                             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2024-12905                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2025-48387 │          │        │                   │ 1.16.5, 2.1.3, 3.0.9                                    │ tar-fs: tar-fs has issue where extract can write outside the │
│                                │                │          │        │                   │                                                         │ specified dir...                                             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2025-48387                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2025-59343 │          │        │                   │ 3.1.1, 2.1.4, 1.16.6                                    │ tar-fs: tar-fs symlink validation bypass                     │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2025-59343                   │
└────────────────────────────────┴────────────────┴──────────┴────────┴───────────────────┴─────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────┘
```
I asked AI for what packages I need to update to fix these. It told me to update the dependencies in package.json to
``` json
"dependencies": {
	"bcrypt": "^6.0.0",
	"cookie-parser": "~1.4.7",
	"debug": "~2.6.9",
	"express": "^4.22.3",
	"http-errors": "~2.0.0",
	"morgan": "^1.12.1",
	"pug": "^3.0.3",
	"sqlite3": "^6.0.1"
}
```
This fixed half of the node vulnerabilities, leaving only 20 and the 4 container vulnerabilities.
```
blog:latest (alpine 3.23.4)
===========================
Total: 4 (HIGH: 4, CRITICAL: 0)

┌────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬──────────────────────────────────────────────────────────┐
│  Library   │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │                          Title                           │
├────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼──────────────────────────────────────────────────────────┤
│ libcrypto3 │ CVE-2026-14456 │ HIGH     │ fixed  │ 3.5.6-r0          │ 3.5.8-r0      │ openssl: OpenSSL: Denial of Service via unbounded memory │
│            │                │          │        │                   │               │ growth in QUIC server...                                 │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-14456               │
│            ├────────────────┤          │        │                   ├───────────────┼──────────────────────────────────────────────────────────┤
│            │ CVE-2026-45447 │          │        │                   │ 3.5.7-r0      │ openssl: Heap Use-After-Free in OpenSSL PKCS7_verify()   │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-45447               │
├────────────┼────────────────┤          │        │                   ├───────────────┼──────────────────────────────────────────────────────────┤
│ libssl3    │ CVE-2026-14456 │          │        │                   │ 3.5.8-r0      │ openssl: OpenSSL: Denial of Service via unbounded memory │
│            │                │          │        │                   │               │ growth in QUIC server...                                 │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-14456               │
│            ├────────────────┤          │        │                   ├───────────────┼──────────────────────────────────────────────────────────┤
│            │ CVE-2026-45447 │          │        │                   │ 3.5.7-r0      │ openssl: Heap Use-After-Free in OpenSSL PKCS7_verify()   │
│            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2026-45447               │
└────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴──────────────────────────────────────────────────────────┘

Node.js (node-pkg)
==================
Total: 20 (HIGH: 19, CRITICAL: 1)

┌────────────────────────────────┬────────────────┬──────────┬────────┬───────────────────┬─────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────┐
│            Library             │ Vulnerability  │ Severity │ Status │ Installed Version │                      Fixed Version                      │                            Title                             │
├────────────────────────────────┼────────────────┼──────────┼────────┼───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ brace-expansion (package.json) │ CVE-2026-13149 │ HIGH     │ fixed  │ 2.0.1             │ 5.0.7, 1.1.16, 2.1.2                                    │ brace-expansion: Brace-expansion: Denial of Service due to   │
│                                │                │          │        │                   │                                                         │ exponential-time complexity                                  │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-13149                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-14257 │          │        │                   │ 5.0.8, 3.0.3, 2.1.3, 1.1.17                             │ brace-expansion: Brace-expansion: Denial of Service via      │
│                                │                │          │        │                   │                                                         │ memory exhaustion in expand() function                       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-14257                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-69152 │          │        │                   │ 1.1.18, 2.1.4, 3.0.6, 5.0.9                             │ brace-expansion: DoS via unbounded intermediate arrays,      │
│                                │                │          │        │                   │                                                         │ bypassing the CVE-2026-14257 mitigation                      │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-69152                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ cross-spawn (package.json)     │ CVE-2024-21538 │          │        │ 7.0.3             │ 7.0.5, 6.0.6                                            │ cross-spawn: regular expression denial of service            │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2024-21538                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ glob (package.json)            │ CVE-2025-64756 │          │        │ 10.4.2            │ 11.1.0, 10.5.0                                          │ glob: glob: Command Injection Vulnerability via Malicious    │
│                                │                │          │        │                   │                                                         │ Filenames                                                    │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2025-64756                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ ip-address (package.json)      │ CVE-2026-69192 │          │        │ 9.0.5             │ 10.3.1                                                  │ ip-address: ip-address: Inconsistent IP address parsing      │
│                                │                │          │        │                   │                                                         │ leads to Server-Side Request Forgery (SSRF)...               │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-69192                   │
├────────────────────────────────┼────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ minimatch (package.json)       │ CVE-2026-26996 │          │        │                   │ 10.2.1, 9.0.6, 8.0.5, 7.4.7, 6.2.1, 5.1.7, 4.2.4, 3.1.3 │ minimatch: minimatch: Denial of Service via specially        │
│                                │                │          │        │                   │                                                         │ crafted glob patterns                                        │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-26996                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-27903 │          │        │                   │ 10.2.3, 9.0.7, 8.0.6, 7.4.8, 6.2.2, 5.1.8, 4.2.5, 3.1.3 │ minimatch: minimatch: Denial of Service due to unbounded     │
│                                │                │          │        │                   │                                                         │ recursive backtracking via crafted...                        │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-27903                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-27904 │          │        │                   │ 10.2.3, 9.0.7, 8.0.6, 7.4.8, 6.2.2, 5.1.8, 4.2.5, 3.1.4 │ minimatch: Minimatch: Denial of Service via catastrophic     │
│                                │                │          │        │                   │                                                         │ backtracking in glob expressions                             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-27904                   │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ pacote (package.json)          │ CVE-2026-9496  │          │        │ 18.0.6            │ 21.5.1                                                  │ Versions of the package pacote from 11.2.7 and before 21.5.1 │
│                                │                │          │        │                   │                                                         │ are vulne...                                                 │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-9496                    │
├────────────────────────────────┼────────────────┤          │        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ sigstore (package.json)        │ CVE-2026-48815 │          │        │ 2.3.1             │ 4.1.1                                                   │ sigstore: Sigstore: Unauthorized certificates accepted due   │
│                                │                │          │        │                   │                                                         │ to ignored `certificateOIDs` verification option             │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-48815                   │
├────────────────────────────────┼────────────────┼──────────┤        ├───────────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ tar (package.json)             │ CVE-2026-59873 │ CRITICAL │        │ 6.2.1             │ 7.5.19                                                  │ tar: node-tar: Denial of Service via crafted gzip bomb       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-59873                   │
│                                ├────────────────┼──────────┤        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-23745 │ HIGH     │        │                   │ 7.5.3                                                   │ node-tar: tar: node-tar: Arbitrary file overwrite and        │
│                                │                │          │        │                   │                                                         │ symlink poisoning via unsanitized linkpaths...               │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-23745                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-23950 │          │        │                   │ 7.5.4                                                   │ node-tar: tar: node-tar: Arbitrary file overwrite via        │
│                                │                │          │        │                   │                                                         │ Unicode path collision race condition...                     │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-23950                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-24842 │          │        │                   │ 7.5.7                                                   │ node-tar: tar: node-tar: Arbitrary file creation via path    │
│                                │                │          │        │                   │                                                         │ traversal bypass in hardlink...                              │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-24842                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-26960 │          │        │                   │ 7.5.8                                                   │ node-tar: node-tar: Arbitrary file read/write via malicious  │
│                                │                │          │        │                   │                                                         │ archive hardlink creation                                    │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-26960                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-29786 │          │        │                   │ 7.5.10                                                  │ node-tar: hardlink path traversal via drive-relative         │
│                                │                │          │        │                   │                                                         │ linkpath                                                     │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-29786                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-31802 │          │        │                   │ 7.5.11                                                  │ tar: tar: File overwrite via drive-relative symlink          │
│                                │                │          │        │                   │                                                         │ traversal                                                    │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-31802                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-59874 │          │        │                   │ 7.5.18                                                  │ tar: Node-tar: Denial of Service via malformed tar archive   │
│                                │                │          │        │                   │                                                         │ header                                                       │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-59874                   │
│                                ├────────────────┤          │        │                   ├─────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┤
│                                │ CVE-2026-73566 │          │        │                   │ 7.5.21                                                  │ tar: node-tar: Denial of Service via crafted long-path tar   │
│                                │                │          │        │                   │                                                         │ archive                                                      │
│                                │                │          │        │                   │                                                         │ https://avd.aquasec.com/nvd/cve-2026-73566                   │
└────────────────────────────────┴────────────────┴──────────┴────────┴───────────────────┴─────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────┘
```
I also had to update my Dockerfile to the following
``` docker
FROM node:24.21.0-alpine3.23 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add --no-cache python3 make g++ \
    && npm ci --omit=dev
FROM node:24.21.0-alpine3.23
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx
EXPOSE 3000
RUN chown -R node:node /usr/src/app
USER node
CMD ["node", "./bin/www"]
```
The main changes are using a newer node image, using a 2 stage build and removing node after the build is complete because it had vulnerable packages bundled in.
After these changes, the vulnerabilities are fixed.
## Nikto
I integrated Nikto to the pipeline by adding the following stage to my Jenkinsfile after the Run stage. It's after the Run stage because Nikto scans the web server which means it naturally needs to be running.
``` groovy
stage('Nikto Scan') {
    steps {
        sh '''
            docker run --rm \
                --network host \
                alpine/nikto \
                -h localhost:3000
        '''
    }
}
```
The scan returns this
```
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          127.0.0.1
+ Target Hostname:    localhost
+ Target Port:        3000
+ Start Time:         2026-09-23 16:12:38 (GMT0)
---------------------------------------------------------------------------
+ Server: No banner retrieved
+ Retrieved x-powered-by header: Express
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Root page / redirects to: /auth/login
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Allowed HTTP Methods: GET, HEAD 
+ 7820 requests: 0 error(s) and 5 item(s) reported on remote host
+ End Time:           2026-09-23 16:12:44 (GMT0) (6 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```
## OWASP Dependency-Check
I integrated OWASP Dependency-Check into my pipeline by installing the plugin and then adding a Dependency-Check installation under Manage Jenkins/Tools. I also added a stage for it between Checkout and Build.
``` groovy
stage('OWASP Dependency-Check Vulnerabilities') {
    steps {
        dependencyCheck additionalArguments: ''' 
                    -o './'
                    -s './'
                    -f 'ALL' 
                    --prettyPrint''', odcInstallation: 'OWASP Dependency-Check'
        
        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
    }
}
```
The check of course fails because I don't have the NVD API key.