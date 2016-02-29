# Simple-ODK Server

This is a [simple-odk](https://github.com/digidem/simple-odk) server configured for Digital Democracy production use with our partners.

## Install

```sh
git clone https://github.com/digidem/simple-odk-digidem
cd simple-odk-digidem
npm install
```

## Setup

We use [dokku](http://dokku.viewdocs.io/dokku/) for deployment. See [digidem-server](https://github.com/digidem/digidem-server) for more details of our server provisioning and configuration.

To deploy a new version of Simple ODK, first ensure you have our production server configured as a github remote:

```sh
git remote -v
# Should output:
# dokku dokku@apps.digital-democracy.org:simple-odk (fetch)
# dokku dokku@apps.digital-democracy.org:simple-odk (push)
# origin  git@github.com:digidem/simple-odk-digidem.git (fetch)
# origin  git@github.com:digidem/simple-odk-digidem.git (push)
```

If `dokku` remote is missing, add it with:

```sh
git remote add dokku dokku@apps.digital-democracy.org:simple-odk
```

Install [dokku-toolbelt](https://github.com/digitalsadhu/dokku-toolbelt):

```sh
npm install -g dokku-toolbelt
```

## Config

Simple-ODK uses environment variables for configuration of API keys. The following keys need to be set in order for everything to work:

- **S3_BUCKET**: This is the default S3 bucket where media will be stored.
- **S3_KEY**: Your [S3 Access Key ID](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html). The S3 bucket should have `s3:PutObject` and `s3:PutObjectAcl` permission for the user associated with this key.
- **S3_SECRET**: [S3 Secret Key](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSGettingStartedGuide/AWSCredentials.html) associated with the Key ID.

By default all media is uploaded to `S3_BUCKET` and the form upload is defined by the URL. E.g. `http://simple-odk-server.com/gh/digidem/sample-monitoring-data/submission` will post a form to the github repo `digidem/sample-monitoring-data`. We can set up aliases and virtual hosts (deprecated) to avoid long, complex URLs and allow the storage backend to be changed without updating the URLs on every phone with ODK Collect.

Set environment variables with `dt config:set S3_BUCKET=my_bucket`

#### `alias-config.json`

Configures aliases for specific configurations in the format:

```json
{
  "github_alias": {
    "formStore": "github",
    "user": "github_owner_of_repo",
    "repo": "github_repo_name",
    "s3bucket": "s3_bucket_name_for_media_uploads"
  },
  "a_different_alias_name": {
    "formStore": "gist",
    "gist_id": "id_of_gist_to_store_forms",
    "s3bucket": "s3_bucket_name_for_media_uploads"
  },
  "firebase_alias": {
    "formStore": "firebase",
    "appname": "firebase_app_name"
  }
}
```

This would mean that any submission to `https://simple-odk-server.com/github_alias/submission` would be stored in the github repo `github_owner_of_repo/github_repo_name`.

#### `vhost-config.json`

Same as `alias-config.json` above but the keys must be fully qualified domain names, the domains should point to the simple-odk server address, and domains need to be added to dokku with `dt domains:add simple-odk my-domain.com`.

#### `nginx.conf`

We customize some `nginx` settings with [`./nginx.conf.d/nginx.conf`](/nginx.conf.d/nginx.conf). This is where we set the maximum upload size, the buffer settings, and timeouts. See the comments for more details. If we are getting timeouts over slow connections we can increase the values here and push a new version to dokku.

## Deployment

Once the environment variables are set we can deploy a new version of simple-odk with:

```sh
git push dokku master
```
