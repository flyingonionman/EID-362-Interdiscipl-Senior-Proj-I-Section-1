import boto3
import datetime
from pymongo import MongoClient
from flask import Flask, render_template, request, redirect
from bson.objectid import ObjectId

aws = {
    'aws_access_key_id': '',
    'aws_secret_access_key': '',
    'bucket': 'babyvideo',
    'region': 'us-east-2'
}
mongo = {
    'URL': 'mongodb+srv://administrator:babyvideo@babyvideo-vo41z.mongodb.net/test',
    'cluster': 'babyvideo'
}


app = Flask(__name__)

# Connect to AWS
s3 = boto3.client("s3")

# Connect to mongodb
cluster = MongoClient(mongo['URL'])
db = cluster[mongo['cluster']]
col = db['videos']


@app.route('/videos')
def index():
    try:
        videos = col.find()
        return render_template('index.html', videos=videos)
    except:
        return "Mongodb error ooga"


@app.route('/videos/add/<name>', methods=['POST'])
def add(name):
    file_name = 'videos/' + name
    try:
        s3.upload_file(file_name, aws['bucket'], name, ExtraArgs={"ACL": "public-read",
                                                                  "ContentType": "video/mp4"})
    except:
        return "AWS error"

    url = 'https://{}.s3.{}.amazonaws.com/{}'.format(
        aws['bucket'], aws['region'], name)
    video = {
        'name': name,
        'link': url,
        'tags': []
    }
    try:
        col.insert_one(video)
    except:
        return "Mongodb error"


@app.route('/videos/delete/<id>', methods=['DELETE'])
def delete(id):
    try:
        video = col.find_one({'_id': ObjectId(id)})
    except:
        return "Mongodb error"
    if not video:
        return "Can't find video"
    key = video['name']
    try:
        s3.delete_object(
            Bucket=aws['bucket'],
            Key=key,
        )
    except:
        return "Aws error"
    try:
        col.delete_one({'_id': ObjectId(id)})
    except:
        return "Mongodb error"

    return redirect('/videos')


@app.route('/videos/tags/<id>')
def view_tags(id):
    try:
        video = col.find_one({'_id': ObjectId(id)})
        return render_template('tags.html', tags=video['tags'], id=id)
    except:
        return "Mongodb error"


@app.route('/videos/addtags/<id>', methods=['POST'])
def add_tags(id):
    try:
        tag = request.values.get("tag")
        col.update_one({'_id': ObjectId(id)}, {'$addToSet': {'tags': tag}})
        return redirect('/videos/tags/{}'.format(id))
    except:
        return "Mongodb error"


@app.route('/videos/deletetags/<id>/<tag>', methods=['POST'])
def delete_tags(id, tag):
    try:
        col.update_one({'_id': ObjectId(id)}, {'$pull': {'tags': tag}})
        return redirect('/videos/tags/{}'.format(id))
    except:
        return "Mongodb error"


@app.route('/videos/search')
def search():
    try:
        tag = request.values.get("tag")
        if not tag:
            return redirect('/videos')
        videos = col.find({"tags": tag})
        return render_template('index.html', videos=videos)
    except:
        return "Mongodb error"


if __name__ == '__main__':
    app.run(port=3000, debug=True)
