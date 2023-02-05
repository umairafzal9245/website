import wave 
import io
from flask import Flask, render_template, request, send_file, Response, jsonify
from scipy.io.wavfile import write, read
from pydub import AudioSegment
import os 
from pymongo import MongoClient, DeleteOne,BulkWrite 
from bson.objectid import ObjectId
import logging
from decouple import config

db_url = config('FLASK_APP_DB_HOST', default='localhost', cast=str)
db_port = config('FLASK_APP_DB_PORT', default=27017, cast=int)

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

@app.route('/login',methods=["POST"])
def login():

    response = Response("Error",mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')

    try:
        email = request.form['email']
        password = request.form['password']
    
        client = MongoClient(db_url, db_port)
        db = client.UrduUsers
        users_collection = db.Users
        user_data = {
            "email": email,
        }
        user = users_collection.find_one(user_data)
        if user:
            if user['password'] == password:
                user['_id'] = str(user['_id'])
                response = jsonify(user)
                response.headers.add('Access-Control-Allow-Origin', '*')
            else:
                response = Response("Password incorrect",mimetype='application/json')
                response.headers.add('Access-Control-Allow-Origin', '*')
        else:
            response = Response("User doesn't exist",mimetype='application/json')
            response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        logging.debug(e)

    return response
    

# @app.route('/register',methods=["POST"])
# def signup():

#     response = Response("Error",mimetype='application/json')
#     response.headers.add('Access-Control-Allow-Origin', '*')

#     try:

#         email = request.form['email']
#         password = request.form['password']
#         gender = request.form['gender']
#         firstname = request.form['firstname']
#         lastname = request.form['lastname']
#         sentences = {"short": [], "medium": [], "long": [], "words": []}
#         skipped = {"short": [], "medium": [], "long": []}
#         extrasentences = {"short": [], "medium": [], "long": []}
#         recorded = {"short": {}, "medium": {}, "long": {}, "words": {}}

#         client = MongoClient(db_url, db_port)
#         db = client['UrduUsers']
#         short = db['Short Sentences']
#         medium = db['Medium Sentences']
#         long = db['Long Sentences']
#         words = db['Words']
#         users = db['Users']

#         bulk_ops = []
#         cursor = short.find().limit(150)
#         for doc in cursor:
#             sentences['short'].append(doc['sentence'])
#             bulk_ops.append(DeleteOne({'sentence':doc['sentence']}))
        
#         short.bulk_write(bulk_ops)

#         bulk_ops = []
#         cursor = medium.find().limit(150)
#         for doc in cursor:
#             sentences['medium'].append(doc['sentence'])
#             bulk_ops.append(DeleteOne({'sentence':doc['sentence']}))

#         medium.bulk_write(bulk_ops)

#         bulk_ops = []
#         cursor = long.find().limit(100)
#         for doc in cursor:
#             sentences['long'].append(doc['sentence'])
#             bulk_ops.append(DeleteOne({'sentence':doc['sentence']}))

#         long.bulk_write(bulk_ops)

      
#         cursor = words.find().limit(100)
#         for doc in cursor:
#             sentences['words'].append(doc['sentence'])
           

#         #write the same logic for extra sentences

#         bulk_ops = []
#         cursor = short.find().limit(150)
#         for doc in cursor:
#             extrasentences['short'].append(doc['sentence'])
#             bulk_ops.append(DeleteOne({'sentence':doc['sentence']}))

#         short.bulk_write(bulk_ops)

#         bulk_ops = []
#         cursor = medium.find().limit(150)
#         for doc in cursor:
#             extrasentences['medium'].append(doc['sentence'])
#             bulk_ops.append(DeleteOne({'sentence':doc['sentence']}))

#         medium.bulk_write(bulk_ops)

#         bulk_ops = []
#         cursor = long.find().limit(100)
#         for doc in cursor:
#             extrasentences['long'].append(doc['sentence'])
#             bulk_ops.append(DeleteOne({'sentence':doc['sentence']}))

#         long.bulk_write(bulk_ops)

#         user_data = {
#             "firstname":firstname,
#             "lastname":lastname,
#             "gender":gender,
#             "email":email,
#             "password":password,
#             "sentences":sentences,
#             "extrasentences":extrasentences,
#             "recorded":recorded,
#             "skipped":skipped
#         }
#         users.create_index("email", unique=True)
#         users.insert_one(user_data)
        
#         user_data['_id'] = str(user_data['_id'])
#         response = jsonify(user_data)
#         response.headers.add('Access-Control-Allow-Origin', '*')
#     except Exception as e:
#         logging.debug(e)
#         if e.code == 11000:
#             response = Response("User already exists",mimetype='application/json')
#             response.headers.add('Access-Control-Allow-Origin', '*')
            
#     return response

#agar update one mein rola ho jaye to jahan se sentence nikala tha wahan dal ke error return kar do
@app.route('/skipSentence', methods=["POST"])
def skipSentence():
    
    response = Response("Error",mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    try:
        userid = request.args.get('id')
        client = MongoClient(db_url, db_port)
        db = client.UrduUsers
        users_collection = db.Users
        userid = ObjectId(userid)
        user_data = {
            "_id": userid,
        }
        user = users_collection.find_one(user_data)
        if user:
            if len(user['sentences']['short']) > 0:
                user['skipped']['short'].append(user['sentences']['short'].pop(0))
                if len(user['extrasentences']['short']) > 0:
                    user['sentences']['short'].append(user['extrasentences']['short'].pop(0))
            elif len(user['sentences']['medium']) > 0:
                user['skipped']['medium'].append(user['sentences']['medium'].pop(0))
                if len(user['extrasentences']['medium']) > 0:
                    user['sentences']['medium'].append(user['extrasentences']['medium'].pop(0))
            elif len(user['sentences']['long']) > 0:
                user['skipped']['long'].append(user['sentences']['long'].pop(0))
                if len(user['extrasentences']['long']) > 0:
                    user['sentences']['long'].append(user['extrasentences']['long'].pop(0))
            else:
                response = Response("No more sentences",mimetype='application/json')
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            
            users_collection.update_one(user_data, {"$set": user})
            user['_id'] = str(user['_id'])
            response = jsonify(user)
            response.headers.add('Access-Control-Allow-Origin', '*')
        else:
            response = Response("User doesn't exist",mimetype='application/json')
            response.headers.add('Access-Control-Allow-Origin', '*') 
    except Exception as e:
        logging.debug(e)
        
        
    return response

#agar updateone mein rola a jaye to sentence jahan se nikala he wahan dal do wapis
#file ke andar be write na karao aur na save karo disk per
#agar file save karte hue error a jaye to audio disk pe na save karao aur updated user change kar do
@app.route('/saveAudio', methods=["POST"])
def saveAudio():

    response = Response("Error",mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    try:
        audio = request.files['audio']
        userid = request.args.get('id')
        email = audio.filename.split('_')[0]
        wavpath = os.path.join('./static/wav',email)
        txtpath = os.path.join('./static/txt',email)
        if not os.path.exists(wavpath):
            os.makedirs(wavpath)
        if not os.path.exists(txtpath):
            os.makedirs(txtpath)
        
        wavname = audio.filename 
        txtname = audio.filename.replace('.weba','.txt')
        wavpath = os.path.join(wavpath,wavname)
        txtpath = os.path.join(txtpath,txtname)    

        client = MongoClient(db_url, db_port)
        db = client.UrduUsers
        users_collection = db.Users
        userid = ObjectId(userid)
        user_data = {
                "_id": userid,
        }
        user = users_collection.find_one(user_data)
        if user:
            sentence = ''
            if len(user['sentences']['short']) > 0:
                sentence = user['sentences']['short'].pop(0)
                user['recorded']['short'][wavname.replace('weba','wav')] = sentence
            elif len(user['sentences']['medium']) > 0:
                sentence = user['sentences']['medium'].pop(0)
                user['recorded']['medium'][wavname.replace('weba','wav')] = sentence
            elif len(user['sentences']['long']) > 0:
                sentence = user['sentences']['long'].pop(0)
                user['recorded']['long'][wavname.replace('weba','wav')] = sentence
            elif len(user['sentences']['words']) > 0:
                sentence = user['sentences']['words'].pop(0)
                user['recorded']['words'][wavname.replace('weba','wav')] = sentence
        
            
            users_collection.update_one(user_data, {"$set": user})

            file = open(txtpath, "w",encoding='utf-8')
            file.write(sentence)
            file.close()

            
            audio.save(wavpath)
            sound = AudioSegment.from_file(wavpath, format="webm")
            sound.export(wavpath.replace('weba', 'wav'), format="wav", bitrate="768k", codec="pcm_s16le")
            # os.remove(wavpath)
            
            user['_id'] = str(user['_id'])
            response = jsonify(user)
            response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        logging.debug(e)
        
    return response  


@app.route('/getAudio',methods=["GET"])
def getAudio():

    response = Response("Error",mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    try:
        audioname = request.args.get('audio')
        email = audioname.split('_')[0]
        wavpath = os.path.join('./static/wav',email,audioname)
        if os.path.exists(wavpath):
            rate, audio = read(wavpath)
            output = io.BytesIO()
            write(output, 48000, audio)
        response = send_file(output, mimetype='audio/wav')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        logging.debug(e)
        
    return response
        
@app.route('/deleteAudio',methods=["POST"])
def deleteAudio():

    response = Response("Error",mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    try:
        audioname = request.args.get('audio')
        userid = request.args.get('id')
        email = audioname.split('_')[0]

        client = MongoClient(db_url, db_port)
        db = client.UrduUsers
        users_collection = db.Users
        userid = ObjectId(userid)
        user_data = {
                "_id": userid,
        }
        user = users_collection.find_one(user_data)
        if user:
            if user['recorded']['short'].get(audioname): 
                sentence = user['recorded']['short'].get(audioname)
                del user['recorded']['short'][audioname]
                user['sentences']['short'].insert(0,sentence)
            elif user['recorded']['medium'].get(audioname):
                sentence = user['recorded']['medium'].get(audioname)
                del user['recorded']['medium'][audioname]
                user['sentences']['medium'].insert(0,sentence)
            elif user['recorded']['long'].get(audioname):
                sentence = user['recorded']['long'].get(audioname)
                del user['recorded']['long'][audioname]
                user['sentences']['long'].insert(0,sentence)
            elif user['recorded']['words'].get(audioname):
                sentence = user['recorded']['words'].get(audioname)
                del user['recorded']['words'][audioname]
                user['sentences']['words'].insert(0,sentence)

            users_collection.update_one(user_data, {"$set": user})

            wavpath = os.path.join('./static/wav',email,audioname)
            wavpath2 = os.path.join('./static/wav',email,audioname.replace('.wav','.weba'))
            txtpath = os.path.join('./static/txt',email,audioname.replace('.wav','.txt'))
            
            
            if os.path.exists(wavpath):
                os.remove(wavpath)
            if os.path.exists(txtpath):
                os.remove(txtpath)
            if os.path.exists(wavpath2):
                os.remove(wavpath2)
        
            user['_id'] = str(user['_id'])
            response = jsonify(user)
            response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        logging.debug(e)
        
    
    return response

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)