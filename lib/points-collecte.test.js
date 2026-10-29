// node --test lib/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formaterHeure, libelleJours, regrouperHoraires, deplierHoraires } from './points-collecte.js'

test('formaterHeure', () => {
  assert.equal(formaterHeure('08:30'), '8h30')
  assert.equal(formaterHeure('09:00'), '9h')
  assert.equal(formaterHeure('14:15'), '14h15')
})

test('libelleJours', () => {
  assert.equal(libelleJours(['vendredi']), 'Vendredi')
  assert.equal(libelleJours(['jeudi', 'lundi']), 'Lundi et jeudi')
  assert.equal(libelleJours(['lundi', 'mardi', 'mercredi', 'jeudi']), 'Lundi au jeudi')
  assert.equal(libelleJours(['lundi', 'mardi', 'jeudi']), 'Lundi, mardi et jeudi')
})

test('regrouperHoraires réunit les jours aux mêmes créneaux', () => {
  const groupes = [
    { jours: 'Lundi et jeudi', creneaux: ['9h30–12h30', '13h30–17h'] },
    { jours: 'Mardi et vendredi', creneaux: ['9h30–12h30'] },
  ]
  assert.deepEqual(regrouperHoraires(deplierHoraires(groupes)), groupes)
})

test('aller-retour sur une semaine ordinaire', () => {
  const groupes = [
    { jours: 'Lundi au jeudi', creneaux: ['8h30–13h', '14h–17h'] },
    { jours: 'Vendredi', creneaux: ['8h30–13h'] },
  ]
  assert.deepEqual(regrouperHoraires(deplierHoraires(groupes)), groupes)
})

test('les créneaux sont triés et les lignes vides ignorées', () => {
  assert.deepEqual(
    regrouperHoraires([
      { jour: 'samedi', ouverture: '14:00', fermeture: '17:00' },
      { jour: 'samedi', ouverture: '09:00', fermeture: '12:00' },
      { jour: 'lundi', ouverture: '', fermeture: '' },
    ]),
    [{ jours: 'Samedi', creneaux: ['9h–12h', '14h–17h'] }],
  )
})
