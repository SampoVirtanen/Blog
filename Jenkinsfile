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
    }
}