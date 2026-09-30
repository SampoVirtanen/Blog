pipeline {
    agent any
    environment {
        IMAGE_NAME = 'blog:latest'
        TRIVY_VERSION = '0.74.0'
    }
    stages {
        stage('Checkout') {
            steps {
                sh 'git pull origin main'
            }
        }
        stage('Unit tests') {
            steps {
                sh '''
                    docker run --rm \
                        -v "$WORKSPACE:/workspace:ro" \
                        node:24.21.0-alpine3.23 \
                        sh -c 'apk add --no-cache python3 make g++ &&
                            mkdir /tmp/blog-test &&
                            cp -R /workspace/. /tmp/blog-test/ &&
                            cd /tmp/blog-test &&
                            npm ci &&
                            npm test'
                '''
            }
        }
        stage('Build') {
            steps {
                sh 'docker build --pull --rm -f "Dockerfile" -t blog:latest "."'
            }
        }
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
        stage('Run') {
            steps {
                sh 'docker stop blog || true'
                sh 'docker rm blog || true'
                sh 'docker run -d -p 3000:3000 --name blog blog'
            }
        }
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
    }
}