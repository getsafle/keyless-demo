if [ -z $DOCKER_HUB_USER ]; then
    printf "ERROR: DOCKER HUB USER ID is not defined, Please set environment variable DOCKER_HUB_USER.";
    exit 1;
fi
if [ -z $DOCKER_HUB_ORG_NAME ]; then
    printf "ERROR: DOCKER HUB ORG NAME is not defined, Please set environment variable DOCKER_HUB_ORG_NAME.";
    exit 1;
fi

if [ -z $DOCKER_HUB_PASSWORD ]; then
    printf "ERROR: DOCKER HUB PASSWORD is not defined, Please set environment variable DOCKER_HUB_PASSWORD.";
    exit 1;
fi

if [ -z $APP_TAG_PREFIX ]; then
    printf "ERROR: Tag Prefix is not defined, Please set environment variable APP_TAG_PREFIX Application Tag Prefix.";
    exit 1
fi

if [ -z $GITHUB_RUN_NUMBER ]; then
    printf "ERROR: Build Number is not defined, please set Environment variable GITHUB BUILD NUMBER.";
    exit 1
fi 

printf "Setting Registry Name..."
export DOCKER_HUB_REGISTRY_NAME=$DOCKER_HUB_ORG_NAME/safle-keyless-core

printf "Building from Dockerfile"
printf "Navigate to Internal-Artifacts Directory."
cd $1

if [[ $BITBUCKET_BRANCH =~ ^main- ]]; then
    APP_TAG_PREFIX=main-$APP_TAG_PREFIX
fi

if [[ $BITBUCKET_BRANCH =~ ^stage ]]; then
    APP_TAG_PREFIX=stage-$APP_TAG_PREFIX
fi

if [[ $BITBUCKET_BRANCH =~ ^test ]]; then
    APP_TAG_PREFIX=test-$APP_TAG_PREFIX
fi

if [[ $BITBUCKET_BRANCH =~ ^devops- ]]; then
    APP_TAG_PREFIX=devops-$APP_TAG_PREFIX
fi

if [[ $BITBUCKET_BRANCH =~ ^hotfix-* ]]; then
    APP_TAG_PREFIX=hotfix-$APP_TAG_PREFIX
fi

if [[ $BITBUCKET_BRANCH =~ ^feature-* ]]; then
    APP_TAG_PREFIX=feature-$APP_TAG_PREFIX
fi

if docker build -f Dockerfile -t $DOCKER_HUB_REGISTRY_NAME:$APP_TAG_PREFIX.$GITHUB_RUN_NUMBER -t $DOCKER_HUB_REGISTRY_NAME:latest .; then
    printf "Docker image build successfully.";
    printf "Push Docker Image.";
    if docker push $DOCKER_HUB_REGISTRY_NAME:$APP_TAG_PREFIX.$GITHUB_RUN_NUMBER && docker push $DOCKER_HUB_REGISTRY_NAME:latest; then
        printf "Image[$DOCKER_HUB_REGISTRY_NAME:$GITHUB_RUN_NUMBER] successfully pushed with 'latest' tag."
    else 
        printf "Docker image push failed";
    fi
else
    printf "Docker Image Build Failed";
fi