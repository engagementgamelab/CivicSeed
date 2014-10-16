# Deploying to Amazon AWS

Civic Seed currently deploys to AWS instances for its production server. The following instructions are for setting up a new environment on AWS, redeploying new code and starting/restarting the server. A simplified set of instructions for just updating the AWS instance can be found [here](https://github.com/engagementgamelab/CivicSeed/blob/master/doc/amazon-s3-production-environment.md).


#### Adjust Instances `ulimit`

Because CivicSeed uses web sockets, we need to check the `ulimit` and make sure the number is sufficiently high. CivicSeed runs on REDIS, MongoDB, and Node.js instances, and this step needs to happen (first) for all instances involved. To check the current `ulimit` of an instance, SSH into the given instance, and run the following command:

  $ ulimit -n

Setting the ulimit to the correct number (probably) depends on the instance type, however, following [this stackoverlow answer](http://stackoverflow.com/questions/11342167/how-to-increase-ulimit-on-amazon-ec2-instance/11345256#11345256) `20000` appears to be a good number. You will need to open the `/etc/security/limits.conf` file and set hard and soft limits:

  #<domain> <type> <item> <value>
  * soft nofile 20000
  * hard nofile 20000

Again, this number should be adjusted to fit the instance type and server setup.

After setting ulimits for each instance, reboot the instances.

#### Port Routing via IP Tables

SSH into the Node.js instance (after setting the `ulimit`) and setup an iptable entry to redirect port 80 listening to port 8000 (so you can run your app without `sudo`). (More information on this is available at [this gist](https://gist.github.com/kentbrew/776580).)

  $ sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000

To list what routes exist in the iptables, run the following command:

  $ sudo iptables -t nat -L

#### Mongo DB

CivicSeed uses MongoDB for a data store. Please follow [this guide](http://docs.mongodb.org/ecosystem/platforms/amazon-ec2/) to install an AWS EC2 instance. Amazon Marketplace MongoDB instances are built to just work out of the box on startup, but you'll want to check that you're passing the right internal IP to the CivicSeed environment config file (listed above under "environment configuration").

You can test the mongo-to-node instance connection by running the following command:

  $ MONGO_CON=[connectionString] node ~/CivicSeed/test/test-connect-mongo.js

You can view the MongoDB logs if needed:

  $ sudo cat /var/log/mongo/mongod.log

In rare cases, you may need to kill running MongoDB instances and restart. Here's a quick run of commands:

  $ ps auxwww | grep mongod
  $ sudo kill [the number(s)] # (run this for each number)
  $ sudo mongod --dbpath=/data --repair
  $ sudo chkconfig mongod on
  $ sudo /etc/init.d/mongod start

##### To backup MongoDB data:

On the MongoDB server:

  $ mongodump
  $ zip -rv civicseed_mongo_backup.zip dump/[databasename]/

On your local machine:

  $ scp -i ~/.ssh/civicseed.pem ec2-user@[instanceaddress]:/home/ec2-user/dump/civicseed_mongo_backup.zip ~/Desktop

#### Data Initialization

Before initializing data, we need to make sure there's a super admin to create startup data. To create a temporary user, open a new terminal window and run the following command in the `/CivicSeed` project directory:

  $ node test/boot

This command will load a temporary super admin user with username `temp` and password `temp`. This will allow you to authenticate and initialize the rest of the database.

To initialize data in the databases, once the app is running, sign in using the temporary credentials and navigate to `Admin Console` -> `Startup` (located at `/admin/startup`). On this page is a series of load buttons. (*Data is found in .json files in the `/data` folder of the project, if you wish to modify data before loading.*)

**The loading buttons users, game, colors, and chat only delete and reset the default data (testing users, demo users).  To delete real game data, you must go into the mongo instance and remove them (this is to prevent accidently wiping critical info)

In order to "reset" npc and botanist, it is recommended to use the mongoimport command and use the data files in `data/backup`.  This is due to the fact that while there are original data files in data folder, they aren't up to date since you can always make changes in the admin interface to both the npc and tile data sets.  Therefore it is recommended to occasionally do a mongoexport of these two data sets from production in case a reset is needed.

###Export /Import Data
To export: mongoexport --db civicseed_testing --collection collection_name --out file_name.json

To import: mongoimport --db civic_testing --collection collection_name --file file_name.json --drop

To move file from server to local: scp -i yourpemkey.pem ec2-user@ipaddress:file_name.json ~/Desktop


*Note, when the users are reloaded, this also deletes the `temp` super admin user.*

#### REDIS

CivicSeed uses REDIS for "pubsub" real-time communication and RPC listeners for game interaction (and more). Again, follow [this guide](http://www.codingsteps.com/install-redis-2-6-on-amazon-ec2-linux-ami-or-centos/) to install REDIS on an AWS EC2 instance. (There does not seem to be any good Amazon Marketplace instances at this time.)

[TODO: why was this command necessary???]

  $ sudo sysctl vm.overcommit_memory=1
  [or?]
  '$ sudo vi /etc/sysctl.conf' and add 'vm.overcommit_memory=1' to end

To run the REDIS database as a daemon:

  $ cd /home/ec2-user/redis-2.6.0-rc3
  $ sudo service redis-server start

### Deployment

Before deploying the application, you'll want to pack the assets locally for production. (Technically this can be done in production, but it's not advised.)

  $ SS_ENV=production SS_PACK=1 npm start

You'll need to use the `sudo` command if you're using a production client port lower than 1024:

  $ sudo SS_ENV=production SS_PACK=1 npm start

Once the app is running and assets are packed, make sure to commit the compiled assets (`/client/assets/*`) to git and push them up to where you're hosting static assets.

#### Static Assets

CivicSeed uses Amazon S3 to store static files. Several 3rd party tools are available for managing these files (3Hub, CyberDuck), or you can use the website to upload. However because of header caching and automatic syncing concerns, it is better to use a command line tool called "s3cmd". This tool can be installed easily with homebrew:

  $ brew install s3cmd

Once installed, run the following command (found at the [s3cmd website](http://s3tools.org/s3cmd)), and follow the simple config instructions:

  $ s3cmd --configure

You will need your S3 Access Key and Secret Key handy for the configuration.

Once the configuration is setup, make sure you are in the root of the Civic Seed game folder (`cd CivicSeed`). From the root folder run the following command to sync the static folder with S3.

  s3cmd sync --acl-public --delete-removed --add-header 'Expires: Fri, 30 May 2014 00:00:00 GMT' --add-header='Cache-Control:no-transform,public,max-age=31536000,s-maxage=31536000' --rexclude "$(<client/static/.s3ignore)" client/static/ s3://civicseed/

#### Caching

Remember to set S3 cache headers `max-age` and/or `Expires` headers to files during upload. One year is `31536000`, but it's probably better in this case to set it to three years (`94608000`), since who knows how long things won't change. We can always cache bust it. Note from s3cmd above the following:

  ... --add-header='Cache-Control:public,max-age=94608000' ...

Other helps:

  http://html5boilerplate.com/html5boilerplate-site/built/en_US/docs/cachebusting/
  http://www.newvem.com/how-to-add-caching-headers-to-your-objects-using-amazon-s3/
  https://developers.google.com/speed/articles/caching
  https://github.com/s3tools/s3cmd/issues/37
  http://www.newvem.com/how-to-add-caching-headers-to-your-objects-using-amazon-s3/
  http://stackoverflow.com/questions/3142388/how-to-make-10-000-files-in-s3-public
  http://awspolicygen.s3.amazonaws.com/policygen.html

#### GZipping

  See: http://stackoverflow.com/questions/9988407/set-metadata-while-using-s3cmd-to-upload-static-website-to-amazon-s3
  And: https://github.com/s3tools/s3cmd/issues/37

  ... --add-header='Content-Encoding: gzip' ... ???

### Running Civic Seed

#### Install the App

Civic Seed can be installed from GitHub. Civic Seed also relies on forever to keep the app running, so make sure to install this as a global dependency. SSH into the AWS Node.js instance and run:

  $ git clone https://github.com/engagementgamelab/CivicSeed.git ~/CivicSeed
  $ npm install
  $ npm install -g forever

#### Start Up

To start the app:

  $ cd ~/CivicSeed/
  $ forever -o out.log -e err.log start bin/server

If the app is already running, to avoid downtime, use the restart command instead (for example, if you've just updated using `git pull`):

  $ forever -o out.log -e err.log restart bin/server

#### Updating the App

  $ git pull origin
  $ npm update
  $ forever -o out.log -e err.log restart bin/server

#### Troubleshooting

You can list check the running instance:

  $ forever list

Or check the logs:

  $ cat err.log
  $ cat out.log

To check the environment variables:

  $ set

To actually stop the server:

  $ forever stopall
